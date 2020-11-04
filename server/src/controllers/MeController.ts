import { Get, JsonController, Req, Res } from "routing-controllers";
import { Request, Response } from "express";

@JsonController()
export class MeController {
  @Get("/me")
  me(@Req() req: Request, @Res() res: Response) {
    if (req.session && req.session.user)
      return res.status(200).json({ username: req.session.user });
    else return res.status(401).json(null);
  }
}
