import { ExpressMiddlewareInterface } from "routing-controllers";
import { Request, Response } from "express";
import { bytesToKB } from "../utils/bytesToKB";
import { User } from "../entities/User";

export class MulterCheckAvailableSpace implements ExpressMiddlewareInterface {
  async use(
    req: Request,
    res: Response,
    next?: (err?: any) => any
  ): Promise<any> {
    try {
      const { size } = req.file;
      const sizeInKB = bytesToKB(size);

      const userInDB = await User.findOne({ id: req.session?.user?.id });
      if (typeof userInDB?.usedStorage === "undefined")
        return res.status(500).json({ error: "Internal server error." });

      if (userInDB?.usedStorage + sizeInKB > userInDB.maxStorage)
        return res
          .status(400)
          .json({ error: "You don't have enough storage." });

      if (typeof next !== "undefined") return next();
    } catch (err) {
      console.log(
        "Something went wrong while checking available space in middleware: ",
        err
      );
      return res.status(500).json({ error: "Internal server error." });
    }
  }
}
