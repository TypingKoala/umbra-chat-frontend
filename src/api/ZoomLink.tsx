
// given an input into the zoom link box, return a room name or null if invalid
export const parseZoomLink = (zoomLink: string) => {
  // check if zoom link matches regex
  const zoomLinkRegex = /^http(s)?:\/\/.*.?zoom.us\/j\/\d*(#.*)?$/;
  const zoomLinkFound = zoomLink.match(zoomLinkRegex);

  // check if 9-11 digits with arbitrary whitespace in between
  const meetingIdRegex = /^( *[0-9] *){9,11}$/;
  const meetingIdFound = zoomLink.match(meetingIdRegex);
  
  if (zoomLinkFound) {
    const url = new URL(zoomLink);
    const pathList = url.pathname.split("/");
    const meetingId = pathList[pathList.length - 1];
    return meetingId.toString();
  } else if (meetingIdFound) {
    return zoomLink.replaceAll(' ', '');
  } else {
    return null;
  }

}

