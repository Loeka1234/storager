import { API_ENDPOINT } from "../constants";

export const thumbnailToURL = (thumbnail: string) =>
  `${API_ENDPOINT}/file/thumbnail?fileName=${thumbnail}`;
