import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    ForbiddenException,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';

  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      try {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers['authorization'];
        //     const phoneNum = request.body.phone || request.headers['phone'];
        //     const phone =`"${phoneNum}"`;
        //      console.log(phone);
        if (!authorization || authorization.trim() === '') {
          throw new UnauthorizedException('Please provide token');
        }
        const authToken = authorization.replace('Bearer ', '');
        const resp = await this.authService.verifyToken(authToken);
        request.decodedData = resp;
        return true;
      } catch (error) {
        console.log('auth error - ', error.message);
        throw new ForbiddenException(
          error.message || 'session expired! Please sign In',
        );
      }
    }
  }

// import {
//   Injectable,
//   CanActivate,
//   ExecutionContext,
//   UnauthorizedException,
//   ForbiddenException,
// } from '@nestjs/common';
// import { AuthService } from './auth.service';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private readonly authService: AuthService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const authorization = request.headers['authorization'];
//     const phoneNum = request.body.phone || request.headers['phone'];
//     const phone =`"${phoneNum}"`;
//      console.log(phone);

//     if (!authorization || !authorization.startsWith('Bearer ')) {
//       throw new UnauthorizedException('Please provide Bearer token');
//     }
//     if (!phone) {
//       throw new UnauthorizedException('Please provide phone number');
//     }

//     const token = authorization.split(' ')[1];
//     console.log(token);
    
//     try {
//       await this.authService.validateToken(token, phone);
//       console.log(phone);
      
//       return true;
//     } catch (error) {
//       console.log('auth error - ', error.message);
//       throw new ForbiddenException(error.message || 'Invalid token!!!');
//     }
//   }
// }
