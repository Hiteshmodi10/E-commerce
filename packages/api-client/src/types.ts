export type APIClientModule =
  | 'agent'
  | 'login'
  | 'signup'
  | 'knowledge_base'
  | 'reset_password'
  | 'reset_password_verify_otp'
  | 'resend-otp'
  | 'workflow'
  | 'workspace'
  | 'intent'
  | 'twilio'
  | 'livekit'
  | 'integrations'
  | 'contact'
  | string;

export interface APIClientBase {
  cacheKey: (string | number)[];
  module: APIClientModule;
  options?: {
    enabled?: boolean | ((props: any) => boolean);
    refetchInterval?: number | false;
    refetchIntervalInBackground?: boolean;
    retry?: number;
    keepPreviousData?: boolean;
    refetchOnWindowFocus?: boolean;
  };
}

export interface APIClientQueryBuilder<E, R> extends APIClientBase {
  resolver: (props: E) => Promise<R> | R;
}

export interface APIClientMutationBuilder<E, R> extends APIClientBase {
  resolver: (props: E) => Promise<R> | R;
}
