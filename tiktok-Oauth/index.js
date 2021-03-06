import express from "express";
const app = express();
import fetch from "node-fetch";
import cookieParser from "cookie-parser";
import cors from "cors";

app.use(cookieParser());
app.use(cors());
app.listen(7000, () => console.log("run"));

const CLIENT_KEY = "abc"; // this value can be found in app's developer portal

app.get("/oauth", (req, res) => {
  const csrfState = Math.random().toString(36).substring(2);
  res.cookie("csrfState", csrfState, { maxAge: 60000 });

  let url = "https://open-api.tiktok.com/platform/oauth/connect/";

  url += "?client_key={CLIENT_KEY}";
  url += "&scope=user.info.basic,video.list";
  url += "&response_type=code";
  url += "&redirect_uri={SERVER_ENDPOINT_REDIRECT}";
  url += "&state=" + csrfState;

  res.redirect(url);
});

app.get("/redirect", (req, res) => {
  const { code, state } = req.query;
  const { csrfState } = req.cookies;

  if (state !== csrfState) {
    res.status(422).send("Invalid state");
    return;
  }

  let url_access_token = "https://open-api.tiktok.com/oauth/access_token/";
  url_access_token += "?client_key=" + CLIENT_KEY;
  url_access_token += "&client_secret=" + CLIENT_SECRET;
  url_access_token += "&code=" + code;
  url_access_token += "&grant_type=authorization_code";

  fetch(url_access_token, { method: "post" })
    .then((res) => res.json())
    .then((json) => {
      res.send(json);
    });
});

app.get("/refresh_token/", (req, res) => {
  const refresh_token = req.query.refresh_token;

  let url_refresh_token = "https://open-api.tiktok.com/oauth/refresh_token/";
  url_refresh_token += "?client_key=" + CLIENT_KEY;
  url_refresh_token += "&grant_type=refresh_token";
  url_refresh_token += "&refresh_token=" + refresh_token;

  fetch(url_refresh_token, { method: "post" })
    .then((res) => res.json())
    .then((json) => {
      res.send(json);
    });
});

app.get("/revoke", (req, res) => {
  const { open_id, access_token } = req.query;

  let url_revoke = "https://open-api.tiktok.com/oauth/revoke/";
  url_revoke += "?open_id=" + open_id;
  url_revoke += "&access_token=" + access_token;

  fetch(url_revoke, { method: "post" })
    .then((res) => res.json())
    .then((json) => {
      res.send(json);
    });
});

app.all("*", (req, res) => res.send({}));
