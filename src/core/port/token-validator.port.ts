export interface TokenValidatorPort {
  validateToken(token: string): Promise<any>;
}
