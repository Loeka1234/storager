import axios from "axios";

interface Cursor {
  updatedAt: string;
  fileName: string;
}

export const getRecentFileMetadata = async (
  limit: number,
  cursor?: Cursor
): Promise<FileMetadata[]> => {
  return await axios
    .get(`/file/recent-metadata`, {
      params: {
        limit,
        "cursor-updatedAt": cursor?.updatedAt,
        "cursor-fileName": cursor?.fileName,
      },
    })
    .then(res => res.data);
};
