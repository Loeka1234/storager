import { API_ENDPOINT } from "../constants";

export const getPreviewImageURL = (fileName: string) => {
  return `${API_ENDPOINT}/file/download?fileName=${fileName}`;
};
