// تغيير العنوان مع تغير الأرقام
function updateTitle() {
  // معلومات المقطع
  var videoID = "";
  var part = "snippet,statistics";
  var params = { id: videoID };
  var response = YouTube.Videos.list(part, params);
  var video = response.items[0];

  // متغيرات القناة متاحة للغلق
  var channelID = "";
  var part2 = "snippet,contentDetails,statistics";
  var params2 = { id: channelID };
  var response2 = YouTube.Channels.list(part2, params2);
  var channel = response2.items[0];

  // متغيرات المقطع والقناة
  var videoViews = video.statistics.viewCount;
  var videoLikes = video.statistics.likeCount;
  var videoDislikes = video.statistics.dislikeCount;
  var videoComments = video.statistics.commentCount;
  var channelSubs = channel.statistics.subscriberCount;
  var channelVideos = channel.statistics.videoCount;
  var channelViews = channel.statistics.viewCount;

  // إستخدم المتغيرات لصناعة أي عنوان ببالك
  var videoTitle = `${videoViews}مشاهدة ${videoLikes}اعجاب ${videoDislikes}عدم اعجاب ${videoComments}تعليق ${channelSubs}مشترك ${channelVideos}مقطع ${channelViews}مشاهدات`;

  // تحديث العنوان 💢⚠ لا تغير أي شئ داخل هذه المنطقة ⚠💢
  video.snippet.title = videoTitle;

  try {
    YouTube.Videos.update(video, part);
  } catch (e) {
    throw e;
  }
}

updateTitle();
