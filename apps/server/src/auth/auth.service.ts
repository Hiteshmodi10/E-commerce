import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { UsersService } from '../users/users.service';

function getSupabaseClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;
  if (!SUPABASE_URL) throw new Error('SUPABASE_URL is required in environment');
  if (!SUPABASE_KEY) throw new Error('SUPABASE_KEY is required in environment');
  return createClient(SUPABASE_URL, SUPABASE_KEY);
}

function getAdminSupabaseClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL) throw new Error('SUPABASE_URL is required in environment');
  if (!SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string, name?: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) return { error: error.message };
    const supUser = data.user;
    if (!supUser) return { error: 'No user returned from supabase' };
    const local = await this.usersService.createFromSupabase({ email: supUser.email || email, name, supabaseId: supUser.id });
    return { session: data.session, user: local };
  }

  async login(email: string, password: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    const supUser = data.user;
    if (supUser) {
      const existing = await this.usersService.findOneByEmail(supUser.email || '');
      if (!existing) {
        await this.usersService.createFromSupabase({ email: supUser.email || email, name: (supUser.user_metadata as any)?.name || undefined, supabaseId: supUser.id });
      }
    }
    return { session: data.session, user: data.user };
  }

  async logout() {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
    if (error) return { error: error.message };
    return { success: true };
  }

  async me(token: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getUser(token);
    if (error) return { error: error.message };
    return { user: data.user };
  }

  async resetPassword(email: string, redirectTo?: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) return { error: error.message };
    return { data };
  }

  async changePassword(supabaseId: string, newPassword: string) {
    const adminSupabase = getAdminSupabaseClient();
    if (!adminSupabase) return { error: 'SUPABASE_SERVICE_ROLE_KEY not configured on server' };
    try {
      const { data, error } = await adminSupabase.auth.admin.updateUserById(supabaseId, { password: newPassword });
      if (error) return { error: error.message };
      return { data };
    } catch (err: any) {
      return { error: err?.message || String(err) };
    }
  }

  async checkConfirmation(payload: { supabaseId?: string; email?: string }) {
    const adminSupabase = getAdminSupabaseClient();
    if (!adminSupabase) return { error: 'SUPABASE_SERVICE_ROLE_KEY not configured on server' };
    const { supabaseId, email } = payload;
    try {
      let userData;
      if (supabaseId) {
        const { data, error } = await adminSupabase.auth.admin.getUserById(supabaseId);
        if (error) return { error: error.message };
        userData = data.user;
      } else if (email) {
        // list users by email is not directly supported; use listUsers and filter
        const { data, error } = await adminSupabase.auth.admin.listUsers();
        if (error) return { error: error.message };
        userData = data.users.find((u: any) => u.email === email);
      }
      if (!userData) return { error: 'User not found' };
  // Supabase user object uses `email_confirmed_at` for email confirmation timestamp.
  const confirmed = Boolean(userData.email_confirmed_at || userData.confirmed_at);
  return { confirmed, user: userData };
    } catch (err: any) {
      return { error: err?.message || String(err) };
    }
  }

  async resendConfirmation(email: string) {
    // Supabase doesn't have a direct 'resend confirmation' endpoint; a common approach is to call invite/signup endpoint again
    const adminSupabase = getAdminSupabaseClient();
    if (!adminSupabase) return { error: 'SUPABASE_SERVICE_ROLE_KEY not configured on server' };
    try {
      // Try to send an invite/signup link by creating a new invite link via admin API
      const { data: usersData, error: listError } = await adminSupabase.auth.admin.listUsers();
      if (listError) return { error: listError.message };
      const user = usersData.users.find((u: any) => u.email === email);
      if (!user) return { error: 'User not found' };

      // There is no direct API to re-send the confirmation email; as a workaround, update the user's email_confirm status by sending a password reset which triggers an email
      const { data, error } = await adminSupabase.auth.resetPasswordForEmail(email);
      if (error) return { error: error.message };
      return { data };
    } catch (err: any) {
      return { error: err?.message || String(err) };
    }
  }
}
