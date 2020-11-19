import axios from "axios";

export const searchMetadata = async (
  searchString: string,
  options?: {
    limit?: number;
    page?: number;
  }
) => {
  console.log("searchString: ", searchString);
  return (await axios
    .get("/file/search-metadata", {
      params: {
        searchString: searchString,
        ...options,
      },
    })
    .then(res => res.data)) as FileMetadata[];
};
