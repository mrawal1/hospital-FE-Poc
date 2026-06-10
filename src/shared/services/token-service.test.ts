import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { tokenService } from './token-service';

/**
 * Creates a valid JWT-shaped token with Base64URL-encoded payload.
 * Note: the signature is intentionally fake since we only test client-side exp checks.
 */
function makeJwt(payload: object): string {
  const encodeBase64Url = (obj: object) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  const header = encodeBase64Url({ alg: 'HS256', typ: 'JWT' });
  const body = encodeBase64Url(payload);
  return `${header}.${body}.fake-signature`;
}

const VALID_TOKEN = makeJwt({ exp: Math.floor(Date.now() / 1000) + 3600, sub: '1' });
const EXPIRED_TOKEN = makeJwt({ exp: Math.floor(Date.now() / 1000) - 3600, sub: '1' });
const NO_EXP_TOKEN = makeJwt({ sub: '1' });

describe('tokenService', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  describe('setToken / getToken', () => {
    it('stores and retrieves a token', () => {
      tokenService.setToken('abc.def.ghi');
      expect(tokenService.getToken()).toBe('abc.def.ghi');
    });

    it('returns null when no token has been stored', () => {
      expect(tokenService.getToken()).toBeNull();
    });
  });

  describe('removeToken', () => {
    it('clears the stored token', () => {
      tokenService.setToken(VALID_TOKEN);
      tokenService.removeToken();
      expect(tokenService.getToken()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('returns false when no token is stored', () => {
      expect(tokenService.isAuthenticated()).toBe(false);
    });

    it('returns true for a valid non-expired JWT', () => {
      tokenService.setToken(VALID_TOKEN);
      expect(tokenService.isAuthenticated()).toBe(true);
    });

    it('returns false for an expired JWT', () => {
      tokenService.setToken(EXPIRED_TOKEN);
      expect(tokenService.isAuthenticated()).toBe(false);
    });

    it('returns false for a JWT with no exp field', () => {
      tokenService.setToken(NO_EXP_TOKEN);
      expect(tokenService.isAuthenticated()).toBe(false);
    });

    it('returns false for a malformed non-JWT string', () => {
      tokenService.setToken('this-is-not-a-jwt');
      expect(tokenService.isAuthenticated()).toBe(false);
    });

    it('returns false after removeToken is called on a valid token', () => {
      tokenService.setToken(VALID_TOKEN);
      tokenService.removeToken();
      expect(tokenService.isAuthenticated()).toBe(false);
    });
  });
});
