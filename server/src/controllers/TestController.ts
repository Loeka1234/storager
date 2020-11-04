import { Request } from "express";
import { Get, JsonController, Req } from "routing-controllers";

@JsonController("/test")
export class TestController {
  @Get("/")
  testGet(@Req() req: Request) {
    console.log("Session: ", req.session!.user);
    return "test";
  }
}
