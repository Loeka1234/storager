import React, { createContext, useState } from "react";
import { ImagePreviewer } from "../components/FilePreviewer/ImagePreviewer.comp";

interface ContextTypes {
  previewFile: (
    fileToDisplay: FileMetadata,
    handleDownload: () => Promise<void>
  ) => void;
}

export const FilePreviewerContext = createContext<ContextTypes | null>(null);

export const FilePreviewerProvider: React.FC = ({ children }) => {
  const [comp, setComp] = useState<JSX.Element>();

  const previewFile = (
    fileToDisplay: FileMetadata,
    handleDownload: () => Promise<void>
  ) => {
    if (!fileToDisplay) {
      setComp(undefined);
      handleDownload();
      return;
    }

    switch (fileToDisplay.mimeType) {
      case "image/jpeg":
      case "image/png":
        setComp(
          <ImagePreviewer
            handleDownload={handleDownload}
            file={fileToDisplay}
            closePreview={closePreview}
          />
        );
        break;
      default:
        setComp(undefined);
        handleDownload();
        break;
    }
  };

  const closePreview = () => {
    setComp(undefined);
  };

  return (
    <FilePreviewerContext.Provider value={{ previewFile }}>
      {comp}
      {children}
    </FilePreviewerContext.Provider>
  );
};
