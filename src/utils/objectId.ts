const HEX_CHARS = '0123456789abcdef';

export function createObjectId() {
  let result = '';
  for (let i = 0; i < 24; i += 1) {
    result += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
  }
  return result;
}
