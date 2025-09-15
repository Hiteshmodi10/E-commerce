import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { Public } from './public.decorator';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ConfirmCheckDto } from './dto/confirm-check.dto';
import { ResendConfirmDto } from './dto/resend-confirm.dto';

@ApiTags('auth')
@Controller('api/auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up via Supabase and persist local user' })
  @ApiResponse({ status: 201, description: 'User signed up' })
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body.email, body.password, body.name, body.role);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login via Supabase' })
  @ApiResponse({ status: 200, description: 'User logged in' })
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout via Supabase' })
  logout() {
    return this.authService.logout();
  }

  @Get('me')
  @ApiOperation({ summary: 'Get user by token (pass token in Authorization header)' })
  me(@Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    return this.authService.me(token);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Request reset password email via Supabase' })
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.email, body.redirectTo);
  }

  @Post('resend-verification')
  @ApiOperation({ summary: 'Resend verification / confirmation email' })
  resendVerification(@Body() body: ResendVerificationDto) {
    return this.authService.resendConfirmation(body.email);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Check email confirmation status or verify using OTP' })
  verifyEmail(@Body() body: VerifyEmailDto) {
    // This endpoint checks confirmation status; if OTP flow is required, implement accordingly
    return this.authService.checkConfirmation({ email: body.email });
  }

  @Post('check-confirmation')
  @ApiOperation({ summary: 'Check if a user has confirmed their email (admin key required)' })
  checkConfirmation(@Body() body: ConfirmCheckDto) {
    return this.authService.checkConfirmation({ supabaseId: body.supabaseId, email: body.email });
  }

  @Post('resend-confirmation')
  @ApiOperation({ summary: 'Resend confirmation email (best-effort via reset link)' })
  resendConfirmation(@Body() body: ResendConfirmDto) {
    return this.authService.resendConfirmation(body.email);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change password using Supabase admin key' })
  changePassword(@Body() body: ChangePasswordDto) {
    return this.authService.changePassword(body.supabaseId, body.newPassword);
  }
}
