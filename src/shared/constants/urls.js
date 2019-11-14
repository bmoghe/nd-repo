import { getSlashSeparatedValue } from "../utils";
const { protocol, hostName, port } = window.location;
export const SERVER_URL = process.env.NODE_ENV === 'production' ? `${protocol}//${hostName}` : `${protocol}//${hostName}:${port}`;

export const BASE_URL = () => {
  let retUrl, projectId = getSlashSeparatedValue(window.location.href, 'project', '#');
  let documentID = getSlashSeparatedValue(window.location.href, 'document', '#');
  if (projectId && projectId !== 'undefined' && documentID && documentID !== 'undefined') {
    retUrl = `/project/${projectId}/document/${documentID}`;
  } else if (projectId && projectId !== 'undefined') {
    retUrl = `/project/${projectId}`;
  } else if (documentID && documentID !== 'undefined') {
    retUrl = `/document/${documentID}`;
  } else {
    retUrl = "";
  }

  return retUrl;
}
