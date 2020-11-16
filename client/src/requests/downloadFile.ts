import axios from "axios";
import { saveAs } from "file-saver";

export const downloadFile = async (
  fileName: string,
  mimeType: string,
  realName: string
) => {
  const res = await axios.get(`/file/download`, {
    responseType: "blob",
    params: {
      fileName,
    },
  });

  const blob = new Blob([res.data], {
    type: mimeType,
  });
  saveAs(blob, realName);
};
