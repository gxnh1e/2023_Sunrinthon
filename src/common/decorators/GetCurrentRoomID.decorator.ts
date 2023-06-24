
import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { JwtPayload } from "src/auth/interface/jwtPayload.type";

export const GetCurrentRoomID = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    return request?.body.roomid;
  }
)