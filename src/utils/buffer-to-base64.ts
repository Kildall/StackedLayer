/**
 * Convert an array buffer to a base64 string efficiently
 * @param buffer - The array buffer to convert
 * @returns The base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunks: string[] = [];
  const chunkSize = 0xffff; // Max string length in JS

  // Process the data in chunks to avoid string size limitations
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.slice(i, i + chunkSize);
    chunks.push(String.fromCharCode.apply(null, chunk as unknown as number[]));
  }

  return btoa(chunks.join(''));
}

export { arrayBufferToBase64 };