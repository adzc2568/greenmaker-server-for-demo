import { FirebaseService } from '../../features/firebase/firebase.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly FirebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log();

    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    console.log(token);

    if (!token) {
      throw new UnauthorizedException();
    }

    // this.FirebaseService.test()
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
