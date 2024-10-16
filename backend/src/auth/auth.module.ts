// import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { JwtModule } from '@nestjs/jwt';
// import { JwtStrategy } from './jwt.strategy';
// import { APP_GUARD } from '@nestjs/core';
// import { AuthGuard } from './auth.guard';
// import { PassportModule } from '@nestjs/passport';
// import { RolesGuard } from './roles.guard';

// @Module({
//   imports: [
//     PassportModule,
//     JwtModule.register({
//       secret: process.env.JWT_SECRET || 'your_jwt_secret',
//       signOptions: { expiresIn: '1h' },
//     }),
//   ],
//   providers: [
//     AuthService,
//     JwtStrategy,
    
//     {
//         provide: APP_GUARD,
//         useClass: AuthGuard,
//       }
//     ,
//   ],
//   controllers: [AuthController],
// })
// export class AuthModule {}


import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { JWT_SECRET } from './roles.decorator';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}