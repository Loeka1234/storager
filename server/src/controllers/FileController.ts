import {
  Authorized,
  Body,
  BodyParam,
  CurrentUser,
  Get,
  JsonController,
  Post,
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
import { Max, Min } from "class-validator";
import { getConnection } from "typeorm";

const storage = multer.diskStorage({
  destination: function (req, _, cb) {
    if (!req.session || !req.session.user)
      return cb(new Error("No user in multer destination."), "");

    const storagePath = path.join(
      process.cwd(),
      "storage",
      (req.session.user as SessionUser).username
    );
    if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath);
    cb(null, storagePath);
  },
});

const upload = multer({
  storage,
});

class FileMetadataBody {
  @Min(1)
  @Max(50)
  limit: number;

  cursor: string | null;
}

@JsonController("/file")
export class FileController {
  @Post("/upload")
  @UseBefore(upload.single("file"))
  @Authorized()
  async upload(
    @Req() req: Request,
    @Res() res: Response,
    @CurrentUser() user: SessionUser
  ) {
    console.log(req.file);
    try {
      await File.insert({
        fileName: req.file.filename,
        realName: req.file.originalname,
        mimeType: req.file.mimetype,
        user: () => user.id,
        path: req.file.path,
      });
      return res.status(200).json({ success: "Successfully uploaded file." });
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
    @BodyParam("fileName") fileName: string
  ) {
    const file = await File.findOne({
      where: { fileName },
      relations: ["user"],
    });

    if (file?.user.id != parseInt(user.id))
      return res
        .status(401)
        .json({ error: "The file you're trying to download does not exists." });

    try {
      await promisify<string, void>(res.sendFile.bind(res))(file.path);
      return res;
    } catch (err) {
      console.log("Error while downloading file ", err);
      return res.status(500).json({ error: "Error while downloading file." });
    }
  }

  @Get("/metadata")
  @Authorized()
  async getFileMetadata(
    @CurrentUser() user: SessionUser,
    @Body() body: FileMetadataBody
  ) {
    let meta = getConnection()
      .createQueryBuilder()
      .select('"fileName","realName", "mimeType"')
      .where('"userId" = :id', { id: user.id })
      .from(File, "file")
      .orderBy('"realName"')
      .limit(body.limit);

    if (body.cursor)
      meta = meta.andWhere(`"realName" > :realName`, {
        realName: body.cursor,
      });

    return await meta.execute();
  }
}
