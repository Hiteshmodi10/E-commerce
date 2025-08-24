import { apiService } from "../../service/api-service";
import { APIClientMutationBuilder } from "../../types";
import {
  LoginPayload,
  LoginResponse,
  SignupPayload,
  SignupResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  ChangePasswordPayload,
  ChangePasswordResponse,
} from "./types";

export const loginBuilder: APIClientMutationBuilder<
  LoginPayload,
  LoginResponse
> = {
  cacheKey: ["AUTH", "LOGIN"],
  module: "login",
  resolver: async (props: LoginPayload) =>
    apiService.post<LoginPayload, LoginResponse>("/api/auth/login", props),
};

export const signupBuilder: APIClientMutationBuilder<
  SignupPayload,
  SignupResponse
> = {
  cacheKey: ["AUTH", "SIGNUP"],
  module: "signup",
  resolver: async (props: SignupPayload) =>
    apiService.post<SignupPayload, SignupResponse>("/api/auth/signup", props),
};

export const resetPasswordBuilder: APIClientMutationBuilder<
  ResetPasswordPayload,
  ResetPasswordResponse
> = {
  cacheKey: ["AUTH", "RESET_PASSWORD"],
  module: "reset_password",
  resolver: async (props: ResetPasswordPayload) =>
    apiService.post<ResetPasswordPayload, ResetPasswordResponse>(
      "/api/auth/reset-password",
      props
    ),
};

export const changePasswordBuilder: APIClientMutationBuilder<
  ChangePasswordPayload,
  ChangePasswordResponse
> = {
  cacheKey: ["AUTH", "CHANGE_PASSWORD"],
  module: "change_password",
  resolver: async (props: ChangePasswordPayload) =>
    apiService.post<ChangePasswordPayload, ChangePasswordResponse>(
      "/api/auth/change-password",
      props
    ),
};

export const resendVerificationBuilder: APIClientMutationBuilder<
  { email: string },
  any
> = {
  cacheKey: ["AUTH", "RESEND_VERIFICATION"],
  module: "resend_verification",
  resolver: async (props: { email: string }) =>
    apiService.post("/api/auth/resend-verification", props),
};

export const verifyEmailBuilder: APIClientMutationBuilder<
  { email: string },
  any
> = {
  cacheKey: ["AUTH", "VERIFY_EMAIL"],
  module: "verify_email",
  resolver: async (props: { email: string }) =>
    apiService.post("/api/auth/verify-email", props),
};

export default {
  loginBuilder,
  signupBuilder,
  resetPasswordBuilder,
  changePasswordBuilder,
  resendVerificationBuilder,
  verifyEmailBuilder,
};

// Convenience aliases for common import names used in the frontend
export const loginUserEmailBuilder = loginBuilder;
export const signupUserBuilder = signupBuilder;
export const resendVerificationEmailBuilder = resendVerificationBuilder;
export const verifyUserEmailBuilder = verifyEmailBuilder;
