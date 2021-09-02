import { compactDecrypt } from "jose/jwe/compact/decrypt";
import { FileJweMeta } from "../../src/types";

export async function restoreJweFile(
  jwe: string,
  fileLike: FileJweMeta,
  privateKey: CryptoKey
) {
  let { name, lastModified, type } = fileLike;
  let decrypted = await compactDecrypt(jwe, privateKey);
  let rebuilt = new File([decrypted.plaintext], name, {
    lastModified,
    type,
  });
  return rebuilt;
}
