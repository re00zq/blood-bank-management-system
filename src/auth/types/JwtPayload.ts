export type JwtPayload = {
  sub: number;
  email: string;
  role: 'admin' | 'donor';
};
