import { Body, JsonController, Post, Req, Res } from "routing-controllers";
import { Response, Request } from "express";
import { MinLength } from "class-validator";
import argon2 from "argon2";
import { User } from "../entities/User";
import { API_Key, PG_UNIQUE_VIOLATION } from "../constants";

class LoginData {
  @MinLength(1)
  username: string;
  @MinLength(1)
  password: string;

  async getHashedPassword(): Promise<string> {
    return await argon2.hash(this.password);
  }

  async validatePassword(expectedHash: string): Promise<boolean> {
    return await argon2.verify(expectedHash, this.password);
  }
}

class LoginDataWithApiKey extends LoginData {
  @MinLength(1)
  key: string;

  hasValidKey(): boolean {
    return this.key === API_Key;
  }
}

@JsonController("/user")
export class UserController {
  @Post("/login")
  async login(
    @Body() loginData: LoginData,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const user = await User.findOne({ username: loginData.username });

    if (!user) return res.status(401).json({ error: "Wrong credentials" });

    if (!loginData.validatePassword(user.password))
      return res.status(401).json({ error: "Wrong credentials. " });

    req.session!.user = loginData.username;

    return res.json({ success: "Successfully logged in." });
  }

  @Post("/register")
  async register(
    @Body() registerData: LoginDataWithApiKey,
    @Res() res: Response
  ) {
    if (!registerData.hasValidKey()) {
      res.status(401).json({ error: "Invalid key." });
    }

    try {
      await User.insert({
        username: registerData.username,
        password: await registerData.getHashedPassword(),
      });

      return res.status(200).json({ success: "Successfuly registred. " });
    } catch (err) {
      if (err.code == PG_UNIQUE_VIOLATION)
        return res.status(409).json({ error: "User already exists." });
      else {
        console.error(err);
        return res.status(500).json({ error: "Error while registering." });
      }
    }
  }
}
