import axios from "axios";

export interface PaginatedMetadataCursor {
  realName: string;
  fileName: string;
}

export const getFileMetadata = async (
  limit: number,
  cursor?: PaginatedMetadataCursor
) => {
  return (await axios
    .get("/file/cursor-paginated-metadata", {
      params: {
        limit,
        "cursor-realName": cursor?.realName,
        "cursor-fileName": cursor?.fileName,
      },
    })
    .then(res => res.data)) as FileMetadata[];
};
