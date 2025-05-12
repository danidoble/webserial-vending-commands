import { parseToBuffer } from "./parser";

class Relay {
  static connection() {
    return parseToBuffer([0xa0, 0x01, 0x00, 0xa1]);
  }
  static deactivate() {
    return Relay.connection();
  }
  static activate() {
    return parseToBuffer([0xa0, 0x01, 0x01, 0xa2]);
  }
  static custom(data: Uint8Array | Array<number> | string | ArrayBuffer) {
    return parseToBuffer(data);
  }
}

export { Relay };
