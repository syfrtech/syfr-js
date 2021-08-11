import { compactDecrypt } from "jose/jwe/compact/decrypt";

export async function restoreJweFile(jwe, fileLike) {
  let { name, lastModified, type } = fileLike;
  let decrypted = await compactDecrypt(jwe, privateKey);
  let rebuilt = new File([decrypted.plaintext], name, {
    lastModified,
    type,
  });
  return rebuilt;
}
