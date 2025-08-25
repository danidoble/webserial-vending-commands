import { parseToBuffer } from "./parser";

class Relay {
  static instance: Relay;

  build(data: number[] | Uint8Array | Array<number> | string | ArrayBuffer) {
    // @ts-expect-error data[3] is defined
    data[3] = this.withChecksum(data);
    return parseToBuffer(data);
  }

  withChecksum(arr: Uint8Array | Array<number>) {
    let sum = 0;
    arr.forEach((value, index) => {
      if (index !== 3) {
        sum += value;
      }
    });
    return sum;
  }

  static connection(channel: number = 1) {
    return Relay.instance.build([0xa0, channel, 0x00, 0xa1]);
  }
  static deactivate(channel: number = 1) {
    return Relay.connection(channel);
  }
  static activate(channel: number = 1) {
    return Relay.instance.build([0xa0, channel, 0x01, 0xa2]);
  }
  static custom(data: Uint8Array | Array<number> | string | ArrayBuffer) {
    return Relay.instance.build(data);
  }
}

Relay.instance = new Relay();
export { Relay };
