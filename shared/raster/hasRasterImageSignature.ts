export const hasRasterImageSignature = (
  bytes: Uint8Array,
  signature: number[],
  offset = 0,
) =>
  bytes.length >= offset + signature.length &&
  signature.every((value, index) => bytes[offset + index] === value);
