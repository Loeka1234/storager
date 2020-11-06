import { Request } from "express";
import {
  Authorized,
  CurrentUser,
  Get,
  JsonController,
  Req,
} from "routing-controllers";

@JsonController("/test")
export class TestController {
  @Get("/")
  @Authorized()
  testGet(@Req() _: Request, @CurrentUser() user: SessionUser) {
    console.log("Session:", user);
    return user;
  }
}
