import { describe, it, expect } from 'vitest';
import { parseTarget } from './target.js';

describe('parseTarget', () => {
  it('parses domain', () => {
    expect(parseTarget('example.com')).toEqual({
      host: 'example.com',
      port: undefined,
      isIp: false,
    });
  });

  it('parses hostname:port', () => {
    expect(parseTarget('example.com:8443')).toEqual({
      host: 'example.com',
      port: 8443,
      isIp: false,
    });
  });

  it('parses ipv4', () => {
    expect(parseTarget('8.8.8.8')).toEqual({
      host: '8.8.8.8',
      port: undefined,
      isIp: true,
    });
  });

  it('rejects empty', () => {
    expect(() => parseTarget('')).toThrow();
  });
});
