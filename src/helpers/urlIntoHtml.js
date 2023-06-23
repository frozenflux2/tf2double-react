const urlIntoHtml = text => {
  return (text || "").replace(
    /([^\S]|^)(((https?:\/\/)|(www\.))(\S+))/gi,
    function (match, space, url) {
      var hyperlink = url;
      if (!hyperlink.match("^https?://")) {
        hyperlink = "http://" + hyperlink;
      }
      return space + '<a href="' + hyperlink + '" target="_blank" rel="noopener noreferrer">' + url + "</a>";
    }
  );
}

export default urlIntoHtml;