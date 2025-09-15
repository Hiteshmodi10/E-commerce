export interface LoginPayload { email: string; password: string }
export interface LoginResponse { access_token: string }

export interface SignupPayload { email: string; password: string; name?: string; role?: string }
export interface SignupResponse { id: string; email: string }

export interface ResetPasswordPayload { email: string }
export interface ResetPasswordResponse { status: string }

export interface ChangePasswordPayload { access_token: string; newPassword: string }
export interface ChangePasswordResponse { status: string }
