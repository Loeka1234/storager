import { Flex, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { FileList } from "../components/FileList.comp";
import { FilePreviewerProvider } from "../contexts/FilePreviewerContext";
import { SearchFilesContext } from "../contexts/SearchFilesContext";
import { useLocation } from "react-router-dom";

const SearchPage: React.FC = () => {
  const { searchFiles, fetchMore, files, newFilesToFetch } = useContext(
    SearchFilesContext
  )!;
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const queryString = new URLSearchParams(location.search).get("s");

  useEffect(() => {
    const search = async () => {
      if (!queryString) return;

      await searchFiles(queryString);
      setLoading(false);
    };
    search();
  }, [queryString, searchFiles]);

  if (!files) return null;

  return (
    <Flex w="100%" align="center" flexDir="column">
      <Text fontSize="20px">Searched: {queryString}</Text>
      <FilePreviewerProvider>
        <FileList
          files={files}
          fetchMore={fetchMore}
          loading={loading}
          newFilesToFetch={newFilesToFetch}
        />
      </FilePreviewerProvider>
    </Flex>
  );
};

export default SearchPage;
