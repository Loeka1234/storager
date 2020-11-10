import {
	Authorized,
	BodyParam,
	CurrentUser,
	Get,
	JsonController,
	Post,
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
import { Max, Min } from "class-validator";
import { getConnection, getRepository } from "typeorm";
import { bytesToKB } from "./../utils/bytesToKB";
import { User } from "../entities/User";

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

// class FileMetadataQueryParams {
//   @Min(1)
//   @Max(50)
//   limit: number;

//   cursor: string | null;
// }

class FileMetadataQueryParams {
	@Min(1)
	@Max(50)
	limit: number;

	offset?: number;
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
		const { filename, originalname, mimetype, path, size } = req.file; // File size is in bytes
		const sizeInKB = bytesToKB(size);

		try {
			const userInDB = await User.findOne({ id: parseInt(user.id) });
			if (typeof userInDB?.usedStorage === "undefined")
				return res
					.status(500)
					.json({ error: "Internal server error." });

			if (userInDB?.usedStorage + sizeInKB > userInDB.maxStorage)
				return res
					.status(400)
					.json({ error: "You don't have enough storage." });

			// Storing the file
			await File.insert({
				fileName: filename,
				realName: originalname,
				mimeType: mimetype,
				user: () => user.id,
				path,
				size: sizeInKB,
			});

			// Increment used storage
			await getRepository(User).increment(
				{ id: parseInt(user.id) },
				"usedStorage",
				sizeInKB
			);

			return res
				.status(200)
				.json({
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
		@BodyParam("fileName") fileName: string
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
			await promisify<string, void>(res.sendFile.bind(res))(file.path);
			return res;
		} catch (err) {
			console.log("Error while downloading file ", err);
			return res
				.status(500)
				.json({ error: "Error while downloading file." });
		}
	}

	// TODO: Fix cursor pagination instead of offset pagination
	// @Get("/metadata")
	// @Authorized()
	// async getFileMetadata(
	//   @CurrentUser() user: SessionUser,
	//   @QueryParams() params: FileMetadataQueryParams
	// ) {
	//   let meta = getConnection()
	//     .createQueryBuilder()
	//     .select('"fileName","realName", "mimeType"')
	//     .from(File, "file")
	//     .where('"userId" = :id', { id: user.id })
	//     .orderBy('"realName"')
	//     .limit(params.limit);

	//   if (params.cursor)
	//     meta = meta.andWhere(`"realName" > :realName`, {
	//       realName: params.cursor,
	//     });

	//   return await meta.execute();
	// }

	@Get("/metadata")
	@Authorized()
	async getFileMetadata2(
		@CurrentUser() user: SessionUser,
		@QueryParams() params: FileMetadataQueryParams
	) {
		let meta = getConnection()
			.createQueryBuilder()
			.select('"fileName", "realName", "mimeType"')
			.from(File, "file")
			.where('"userId" = :id', { id: user.id })
			.orderBy('"realName"')
			.limit(params.limit)
			.offset(params.offset ? params.offset : 0);

		return await meta.execute();
	}
}
