import {
  Authorized,
  CurrentUser,
  Get,
  JsonController,
  Post,
  QueryParam,
  QueryParams,
  Req,
  Res,
  UseBefore,
} from "routing-controllers";
import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { File } from "../entities/File";
import { promisify } from "util";
import { getConnection, getRepository } from "typeorm";
import { bytesToKB } from "./../utils/bytesToKB";
import { User } from "../entities/User";
import {
  CursorPaginatedByDateQueryParams,
  CursorPaginationQueryParams,
  GetThumbnailParams,
  OffsetPaginationQueryParams,
  SearchParams,
} from "./FileContoller.params";
import { generateThumbnail } from "../utils/generateThumbnail";
import { FILE_METADATA_SELECT } from "../constants";
import { MulterCheckAvailableSpace } from "../middlewares/MulterCheckAvailableSpace.middleware";
import { v4 } from "uuid";

const storage = multer.diskStorage({
  destination: function (req, _, cb) {
    if (!req.session || !req.session.user) return cb(new Error("no user"), "");

    const storagePath = path.join(
      process.cwd(),
      "storage",
      (req.session.user as SessionUser).username
    );
    if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath);
    cb(null, storagePath);
  },
  filename: function (_, file, cb) {
    return cb(null, v4() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
});

const uploadMiddleware = (
  req: Request,
  res: Response,
  next?: (err?: any) => any
) => {
  upload.single("file")(req, res, (err: any) => {
    if (err) console.log("Error after multer: ", err);

    if (err?.message === "no user")
      return res.status(401).json({ error: "Not authenticated." });
    else if (err)
      return res.status(500).json({ error: "Internal server error." });

    if (next) return next();
  });
};

@JsonController("/file")
export class FileController {
  @Post("/upload")
  @UseBefore(MulterCheckAvailableSpace) // Don't change place
  @UseBefore(uploadMiddleware) // Don't change place
  @Authorized()
  async upload(
    @Req() req: Request,
    @Res() res: Response,
    @CurrentUser() user: SessionUser
  ) {
    try {
      const {
        filename,
        originalname,
        mimetype,
        size,
        path: filepath,
      } = req.file; // File size is in bytes
      const sizeInKB = bytesToKB(size);

      // Storing the file
      await File.insert({
        fileName: filename,
        realName: originalname,
        mimeType: mimetype,
        user: () => user.id,
        path: path.join("storage", user.username, filename), // Fixed this
        size: sizeInKB,
      });

      // Increment used storage
      await getRepository(User).increment(
        { id: parseInt(user.id) },
        "usedStorage",
        sizeInKB
      );

      switch (mimetype) {
        case "image/jpeg":
        case "image/png":
          await generateThumbnail(filepath, user.username, filename);
          await File.update(
            { fileName: filename },
            {
              thumbnail: filename.replace(path.extname(filename), "") + ".webp",
            }
          );
          break;
        default:
          break;
      }

      return res.status(200).json({
        success: "Successfully uploaded file.",
        fileSizeUploaded: sizeInKB,
      });
    } catch (err) {
      console.log("Error while saving file to database: ", err);
      return res.status(500).json({ error: "Error while saving file." });
    }
  }

  @Get("/download")
  @Authorized()
  async download(
    @Res() res: Response,
    @CurrentUser() user: SessionUser,
    @QueryParam("fileName") fileName: string
  ) {
    const file = await File.findOne({
      where: { fileName },
      relations: ["user"],
    });

    if (file?.user.id != parseInt(user.id))
      return res.status(401).json({
        error: "The file you're trying to download does not exists.",
      });

    try {
      // res.sendFile(path.join(process.cwd(), file.path), file.realName);
      // await delay(3000);
      // return res;
      await promisify<string, void>(res.sendFile.bind(res))(
        path.join(process.cwd(), file.path)
      );
      return res;
    } catch (err) {
      console.log("Error while downloading file ", err);
      return res.status(500).json({ error: "Error while downloading file." });
    }
  }

  // TODO: Update frontend with cursor paginated metadata
  @Get("/cursor-paginated-metadata")
  @Authorized()
  async getFileMetadata(
    @CurrentUser() user: SessionUser,
    @QueryParams() params: CursorPaginationQueryParams,
    @Res() res: Response
  ) {
    try {
      if (
        (params["cursor-fileName"] && !params["cursor-realName"]) ||
        (params["cursor-realName"] && !params["cursor-fileName"])
      )
        return res.status(400).json({
          error:
            "Params should include 'cursor-fileName' and 'cursor-realName'",
        });

      let meta = getConnection()
        .createQueryBuilder()
        .select(FILE_METADATA_SELECT)
        .from(File, "file")
        .where('"userId" = :id', { id: user.id })
        .orderBy('("realName", "fileName")')
        .limit(params.limit);

      if (params["cursor-fileName"] && params["cursor-realName"]) {
        meta = meta.andWhere(
          '(:realName, :fileName) < ("realName", "fileName")',
          {
            realName: params["cursor-realName"],
            fileName: params["cursor-fileName"],
          }
        );
      }

      return (await meta.execute()) as FileMetadata[];
    } catch (err) {
      console.log("Error while getting cursor paginated filemetadata: ", err);
      return res.status(500).json({
        error: "Something went wrong while getting filemetadata.",
      });
    }
  }

  // TODO: fix frontend url
  @Get("/offset-paginated-metadata")
  @Authorized()
  async getFileMetadata2(
    @CurrentUser() user: SessionUser,
    @QueryParams() params: OffsetPaginationQueryParams,
    @Res() res: Response
  ) {
    try {
      let meta = getConnection()
        .createQueryBuilder()
        .select(FILE_METADATA_SELECT)
        .from(File, "file")
        .where('"userId" = :id', { id: user.id })
        .orderBy('"realName"')
        .limit(params.limit)
        .offset(params.offset ? params.offset : 0);

      return (await meta.execute()) as FileMetadata[];
    } catch (err) {
      console.log("Error while getting offset paginated filemetadata: ", err);
      return res.status(500).json({
        error: "Something went wrong while getting filemetadata.",
      });
    }
  }

  @Get("/recent-metadata")
  @Authorized()
  async recentMetadataNextPage(
    @CurrentUser() user: SessionUser,
    @QueryParams() params: CursorPaginatedByDateQueryParams,
    @Res() res: Response
  ) {
    try {
      if (
        (params["cursor-fileName"] && !params["cursor-updatedAt"]) ||
        (params["cursor-updatedAt"] && !params["cursor-fileName"])
      )
        return res.status(400).json({
          error:
            "Params can not include one of 'cursor-fileName' and 'cursor-updatedAt'",
        });

      let meta = getConnection()
        .createQueryBuilder()
        .select(FILE_METADATA_SELECT)
        .from(File, "file")
        .where('"userId" = :id', { id: user.id })
        .orderBy('("updatedAt", "fileName")', "DESC")
        .limit(params.limit);

      if (params["cursor-fileName"] && params["cursor-updatedAt"])
        meta = meta.andWhere(
          '(:updatedAt, :fileName) > ("updatedAt", "fileName")',
          {
            updatedAt: new Date(params["cursor-updatedAt"]),
            fileName: params["cursor-fileName"],
          }
        );

      // TODO: Size has te be converted from a string to a float, create a better way to handle this as size should be a float
      return (await meta.execute().then((data: File[]) =>
        data.map(el => ({
          ...el,
          size: parseFloat((el.size as unknown) as string),
        }))
      )) as FileMetadata[];
    } catch (err) {
      console.log("Error while getting recent metadata: ", err);
      return res.status(500).json({
        error: "Could not get recent filemetadata.",
      });
    }
  }

  @Get("/thumbnail")
  @Authorized()
  async getThumbnail(
    @Res() res: Response,
    @CurrentUser() user: SessionUser,
    @QueryParams() params: GetThumbnailParams
  ) {
    try {
      // TODO: create reusable function
      await promisify<string, void>(res.sendFile.bind(res))(
        path.join(process.cwd(), "thumbnails", user.username, params.fileName)
      );
      return res;
    } catch (err) {
      console.log("Error while sending thumbnail: ", err);
      return res.status(401).json({ error: "You can not access this file." });
    }
  }

  @Get("/search-metadata")
  @Authorized()
  async searchMetadata(
    @Res() res: Response,
    @CurrentUser() user: SessionUser,
    @QueryParams() params: SearchParams
  ) {
    try {
      const limit = params.limit || 50;

      if (limit < 0 || limit > 100)
        return res
          .status(400)
          .json({ error: "Limit should be between 0 and 100." });

      let meta = getConnection()
        .createQueryBuilder()
        .select(FILE_METADATA_SELECT)
        .from(File, "file")
        .where('"userId" = :userId', { userId: user.id })
        .andWhere(`"realName" LIKE :searchString`, {
          searchString: `%${params.searchString}%`,
        })
        .limit(limit);

      if (params.page) meta.offset(params.page * limit);

      return await meta.execute();
    } catch (err) {
      console.log("Error while searching: ", err);
      return res.status(500).json({ error: "Internal server error. " });
    }
  }
}
