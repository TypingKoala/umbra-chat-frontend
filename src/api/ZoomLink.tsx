var Url = require('url-parse');

export interface IZoomLinkParams {
  domain: string,
  meetingId: string,
}

export const parseZoomLink = (zoomLink: string) => {
  const url = new URL(zoomLink);
  const domain = url.hostname.split(".")[0];
  const pathList = url.pathname.split("/");
  const meetingId = pathList[pathList.length - 1];
  const result: IZoomLinkParams = { domain, meetingId };
  return result;
}

