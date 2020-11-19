import sharp from "sharp";
import path from "path";
import { existsSync, mkdirSync } from "fs";

export const generateThumbnail = async (
  filePath: string,
  username: string,
  fileName: string
): Promise<sharp.OutputInfo> => {
  return new Promise((resolve, reject) => {
    const thumnailPath = path.join(process.cwd(), "thumbnails", username);

    if (!existsSync(thumnailPath)) mkdirSync(thumnailPath);

    const fileNameWithoutExt = fileName.replace(path.extname(fileName), "");

    sharp(filePath)
      .resize(250, 250)
      .webp()
      .toFile(
        path.join(thumnailPath, fileNameWithoutExt + ".webp"),
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
