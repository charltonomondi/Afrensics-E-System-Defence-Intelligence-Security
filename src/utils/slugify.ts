// src/util/slugify.ts
import slugifyLib from 'slugify';

export const slugify = (text: string) =>
  slugifyLib(text, { lower: true, strict: true });
export default slugify;