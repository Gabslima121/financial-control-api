export interface TokenValidatorPort {
  validateToken(token: string): Promise<any>;
  createToken(payload: any): Promise<string>;
}
