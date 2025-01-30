/**
 * Convert an array buffer to a base64 string efficiently
 * @param buffer - The array buffer to convert
 * @returns The base64 string
 */
function arrayBufferToBase64(buffer: number[] | Uint8Array): string {
  const chunks: string[] = [];
  const chunkSize = 8192; // Process in chunks to avoid call stack issues
  const array = Array.isArray(buffer) ? buffer : Array.from(buffer);
  
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    chunks.push(String.fromCharCode.apply(null, chunk));
  }
  
  return btoa(chunks.join(''));
}

export { arrayBufferToBase64 };