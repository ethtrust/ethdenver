import axios from "axios";
import { create } from "ipfs-http-client";

/** Uses `URL.createObjectURL` free returned ObjectURL with `URL.RevokeObjectURL` when done with it.
 *
 * @param {string} cid CID you want to retrieve
 * @param {string} mime mimetype of image (optional, but useful)
 * @returns ObjectURL
 */
export async function loadImgURL(cid: string, mime?: string) {
  const ipfs = create({ url: "https://ipfs.infura.io:5001/api/v0" });
  console.log(await ipfs.isOnline());
  if (cid == "" || cid == null || cid == undefined) {
    return;
  }

  for await (const file of ipfs.get(cid) as any) {
    const content = [];
    console.log("file ", file);

    if (file.content) {
      for await (const chunk of file.content) {
        content.push(chunk);
      }

      return URL.createObjectURL(new Blob(content, { type: mime }));
    }
  }
}

export function getEllipsisTxt(str: string, n = 4) {
  if (str) {
    return `${str.slice(0, n + 2)}...${str.slice(
      str.length - n
    )}`.toLowerCase();
  }
  return "";
}

export function classNames(...classes: (false | null | undefined | string)[]) {
  return classes.filter(Boolean).join(" ");
}
