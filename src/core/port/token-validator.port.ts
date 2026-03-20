export interface TokenValidatorPort {
  createToken(payload: any): Promise<string>;
  validateToken(token: string): Promise<any>;
  createRefreshToken(payload: any): Promise<string>;
  validateRefreshToken(token: string): Promise<any>;
}
