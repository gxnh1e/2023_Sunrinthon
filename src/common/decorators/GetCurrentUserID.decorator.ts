import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { JwtPayload } from "src/auth/interface/jwtPayload.type";

export const GetCurrentUserID = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return user.id;
  }
)