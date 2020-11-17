import sharp from "sharp";
import path from "path";

export const generateThumbnail = async (
  filePath: string,
  username: string,
  fileName: string
): Promise<sharp.OutputInfo> => {
  return new Promise((resolve, reject) => {
    sharp(filePath)
      .resize(250, 250)
      .webp()
      .toFile(
        path.join(process.cwd(), "thumbnails", username, fileName + ".webp"),
        (err, info) => {
          if (err)
            return reject({
              error: true,
              message: err,
            });

          return resolve(info);
        }
      );
  });
};
