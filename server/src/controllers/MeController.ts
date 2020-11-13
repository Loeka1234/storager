import { CurrentUser, Get, JsonController, Res } from "routing-controllers";
import { Response } from "express";
import { User } from "./../entities/User";

@JsonController()
export class MeController {
	@Get("/me")
	async me(@Res() res: Response, @CurrentUser() user: SessionUser) {
		if (!user) return res.status(401).json(null);

		try {
			const userInDB = await User.findOne(user.id);

			if (!userInDB) throw new Error();

			return res.status(200).json({
				username: userInDB.username,
				usedStorage: userInDB.usedStorage,
				maxStorage: userInDB.maxStorage,
			});
		} catch (err) {
			console.table([
				["error", "Didn't find user in me route."],
				["user session", user],
			]);
			return res
				.status(401)
				.json({ error: "Didn't find user in me route." });
		}
	}
}
