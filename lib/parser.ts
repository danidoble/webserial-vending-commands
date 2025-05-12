export const parseToBuffer = (
  data: Uint8Array | Array<number> | string | ArrayBuffer,
) => {
  if (data instanceof Uint8Array) {
    return data;
  } else if (Array.isArray(data)) {
    return new Uint8Array(data);
  } else if (typeof data === "string") {
    return new TextEncoder().encode(data);
  } else if (data instanceof ArrayBuffer) {
    return new Uint8Array(data);
  } else {
    throw new Error("Unsupported data type");
  }
};

type Uint8ArrayToStringOptions = {
  data: Uint8Array;
  removeAppend?: boolean;
  appended?: string;
};

export const Uint8ArrayToString = ({
  data,
  removeAppend = false,
  appended = "\n",
}: Uint8ArrayToStringOptions): string => {
  const decoder = new TextDecoder("utf-8");
  const decodedString = decoder.decode(data);
  //console.log("Decoded String:", decodedString);
  //console.log("Remove Append:", appended);

  if (removeAppend) {
    return decodedString.replace(new RegExp(appended, "g"), "");
  }
  return decodedString;
};

export const Uint8ArrayToHex = ({
  data,
  asString = true,
}: {
  data: Uint8Array;
  asString?: boolean;
}): string | Array<string> => {
  if (!asString) {
    return Array.from(data).map((byte) => byte.toString(16).padStart(2, "0"));
  }
  return Array.from(data)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join(" ");
};

export const hexToUint8Array = (hex: Array<string>): Uint8Array => {
  const byteArray = new Uint8Array(hex.length);
  for (let i = 0; i < hex.length; i++) {
    byteArray[i] = parseInt(hex[i], 16);
  }
  return byteArray;
};
