// https://developers.tiktok.com/doc/web-video-kit-with-web
(async () => {
  const express = require("express");
  const tiktok = require("tiktok-app-api");

  const expressApp = express();
  const tiktokApp = await tiktok();

  expressApp.listen(8000, () => console.log("run"));

  async function getTrendingVideos(req, res) {
    let videos = [];

    const iterator = tiktokApp.getTrendingVideos();
    let result = await iterator.next();

    while (!result.done) {
      videos = videos.concat(result.value);
      result = await iterator.next();
    }

    res.status(200).send(videos).end();
  }

  async function getUserInfo(req, res) {
    const userInfo = await tiktokApp.getUserByName(req.params.identifier);
    console.log(userInfo);
    res.send({ userInfo });
  }

  async function getUploadedVideos(req, res) {
    const user = await getUser(req.params.identifier);

    let videos = [];

    const iterator = tiktokApp.getUploadedVideos(user);
    let result = await iterator.next();

    while (!result.done) {
      videos = videos.concat(result.value);
      result = await iterator.next();
    }

    res.status(200).send(videos).end();
  }

  async function getLikedVideos(req, res) {
    const user = await getUser(req.params.identifier);

    let videos = [];

    const iterator = tiktokApp.getLikedVideos(user);
    let result = await iterator.next();

    while (!result.done) {
      videos = videos.concat(result.value);
      result = await iterator.next();
    }

    res.status(200).send(videos).end();
  }

  async function getVideoInfo(req, res) {
    const video = tiktokApp.getVideo(req.params.id);

    let videoInfo;
    try {
      videoInfo = await tiktokApp.getVideoInfo(video);
    } catch (err) {
      handleError(err, res);
    }

    res.status(200).send(videoInfo).end();
  }

  async function getAudioInfo(req, res) {
    const audio = tiktokApp.getAudio(req.params.id);

    let audioInfo;
    try {
      audioInfo = await tiktokApp.getAudioInfo(audio);
    } catch (err) {
      handleError(err, res);
    }

    res.status(200).send(audioInfo).end();
  }

  async function getAudioTopVideos(req, res) {
    const audio = tiktokApp.getAudio(req.params.id);

    let videos = [];

    const iterator = tiktokApp.getAudioTopVideos(audio);
    let result = await iterator.next();

    while (!result.done) {
      videos = videos.concat(result.value);
      result = await iterator.next();
    }

    res.status(200).send(videos).end();
  }

  async function getTagInfo(req, res) {
    let tagInfo;

    try {
      tagInfo = await tiktokApp.getTagInfo(req.params.id);
    } catch (err) {
      handleError(err, res);
    }

    res.status(200).send(tagInfo).end();
  }

  async function getTagTopVideos(req, res) {
    const tag = await tiktokApp.getTag(req.params.id);

    let videos = [];

    const iterator = tiktokApp.getTagTopVideos(tag);
    let result = await iterator.next();

    while (!result.done) {
      videos = videos.concat(result.value);
      result = await iterator.next();
    }

    res.status(200).send(videos).end();
  }

  async function getUser(id) {
    return isNaN(Number(id))
      ? await tiktokApp.getUserByName(id)
      : Promise.resolve(tiktokApp.getUserByID(id));
  }

  function handleError(err, res) {
    let statusCode;

    if (err instanceof tiktokApp.IllegalIdentifier) {
      statusCode = 400;
    } else if (err instanceof tiktokApp.ResourceNotFound) {
      statusCode = 404;
    }

    const body = {
      error: err.message,
    };
    res.status(statusCode).send(body).end();
  }

  expressApp.get("/api/trending", getTrendingVideos);

  expressApp.get("/api/user/:identifier", getUserInfo);
  expressApp.get("/api/user/:identifier/uploaded", getUploadedVideos);
  expressApp.get("/api/user/:identifier/liked", getLikedVideos);

  expressApp.get("/api/video/:id", getVideoInfo);

  expressApp.get("/api/audio/:id", getAudioInfo);
  expressApp.get("/api/audio/:id/videos", getAudioTopVideos);

  expressApp.get("/api/tag/:id", getTagInfo);
  expressApp.get("/api/tag/:id/videos", getTagTopVideos);
})();
