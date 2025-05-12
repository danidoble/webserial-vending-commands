import { parseToBuffer } from "./parser";

type cellChannelType = {
  cell?: number | string;
  channel?: number;
};

class Locker {
  static asHex: boolean = false;
  static instance: Locker;

  serialLockerCmdMaker(cmd: Uint8Array): Uint8Array {
    const time = 666;
    // const time = new Date().getMilliseconds();
    let array: Uint8Array;
    try {
      array = new Uint8Array(cmd.length + 8);
      array.set(cmd, 2);
      array[0] = 2;
      array[1] = cmd.length + 4;
      array[array.length - 2] = 3; // end Byte

      let cmdSum = 0;
      for (let i = 1; i < cmd.length; i++) {
        cmdSum += cmd[i];
        cmdSum *= parseInt(Math.pow(2, i - 1).toString());
      }
      array[cmd.length + 2] = cmdSum % 256;
      array[cmd.length + 3] = (time * 3) % 256;
      array[cmd.length + 4] = (time * 8) % 256;

      let checksum = 0;
      for (let i = 3; i < cmd.length + 5; i++) {
        checksum += array[i];
      }
      array[cmd.length + 5] = checksum % 256;

      // Calc XOR for all bytes except the last one
      let xorValue = 0;
      for (let i = 0; i < array.length - 1; i++) {
        xorValue ^= array[i];
      }
      array[array.length - 1] = xorValue;
    } catch (ex: unknown) {
      array = new Uint8Array(0);
      if (ex instanceof Error) {
        throw new Error(`Error generating command: ${ex.message}`);
      }
      throw new Error("Error generating command: Unknown error");
    }
    return array;
  }

  serialLockerHexCmd(command: Uint8Array): Array<string> {
    const cmd = this.serialLockerCmdMaker(command);
    const hex: Array<string> = [];
    for (let i = 0; i < cmd.length; i++) {
      const byte = cmd[i];
      const hexByte = byte.toString(16).padStart(2, "0");
      hex.push(hexByte);
    }
    return hex;
  }

  validateCell(cell: number | string = 1): number {
    let n: number;
    if (typeof cell === "string") {
      n = parseInt(cell);
    } else {
      n = cell;
    }
    if (isNaN(n) || n < 1 || n > 90) throw new Error("Invalid cell number");

    return n;
  }

  serialLockerGetStatusCellCmd({
    cell = 1,
    channel = 1,
  }: cellChannelType = {}): Uint8Array | Array<string> {
    cell = this.validateCell(cell);
    return this.build(new Uint8Array([16, channel, cell]));
  }

  serialLockerGetLightScanCmd({ since = 0, until = 10, channel = 1 } = {}):
    | Uint8Array
    | Array<string> {
    return this.build(new Uint8Array([32, channel, since, until]));
  }

  parseCellToColumnRow(cell: number): [number, number] {
    const column = Math.floor((cell - 1) / 10) + 1;
    let row = cell % 8;
    if (row === 0) row = 8;
    return [column, row];
  }

  serialLockerGetConfigureCellCmd({
    enable = true,
    column = 0,
    row = 10,
    channel = 1,
  } = {}): Uint8Array | Array<string> {
    if (column < 0 || column > 8) throw new Error("Invalid column number");
    if (row < 0 || row > 10) throw new Error("Invalid row number");
    let status = 1;
    if (!enable) status = 0;
    return this.build(new Uint8Array([48, channel, column, row, status]));
  }

  serialLockerGetOpenCmd({ cell = 1, channel = 1 }: cellChannelType = {}):
    | Uint8Array
    | Array<string> {
    cell = this.validateCell(cell);
    const time = 666;
    //const time = new Date().getMilliseconds();
    const timeHigh = time % 256;
    const timeLow = Math.floor(time / 3) % 256;
    return this.build(new Uint8Array([64, channel, cell, timeHigh, timeLow]));
  }

  build(data: Uint8Array): Uint8Array | Array<string> {
    if (!Locker.asHex) return parseToBuffer(this.serialLockerCmdMaker(data));

    return this.serialLockerHexCmd(data);
  }

  static connection({ channel = 1 } = {}): Uint8Array | Array<string> {
    return Locker.instance.build(new Uint8Array([0, channel]));
  }

  static openCell({ cell = 1, channel = 1 }: cellChannelType = {}):
    | Uint8Array
    | Array<string> {
    cell = Locker.instance.validateCell(cell);
    return Locker.instance.serialLockerGetOpenCmd({ cell, channel });
  }

  static statusCell({ cell = 1, channel = 1 }: cellChannelType = {}):
    | Uint8Array
    | Array<string> {
    cell = Locker.instance.validateCell(cell);
    return Locker.instance.serialLockerGetStatusCellCmd({ cell, channel });
  }

  static lightScan({ since = 0, until = 10, channel = 1 } = {}):
    | Uint8Array
    | Array<string> {
    if (since < 0 || since > 10) throw new Error("Invalid since number");
    if (until < 0 || until > 10) throw new Error("Invalid until number");
    return Locker.instance.serialLockerGetLightScanCmd({
      since,
      until,
      channel,
    });
  }

  static enableCell({ cell = 1, channel = 1 }: cellChannelType = {}):
    | Uint8Array
    | Array<string> {
    cell = Locker.instance.validateCell(cell);
    const [column, row] = Locker.instance.parseCellToColumnRow(cell);
    return Locker.instance.serialLockerGetConfigureCellCmd({
      enable: true,
      column,
      row,
      channel,
    });
  }

  static disableCell({ cell = 1, channel = 1 }: cellChannelType = {}):
    | Uint8Array
    | Array<string> {
    cell = Locker.instance.validateCell(cell);
    const [column, row] = Locker.instance.parseCellToColumnRow(cell);
    return Locker.instance.serialLockerGetConfigureCellCmd({
      enable: false,
      column,
      row,
      channel,
    });
  }
}

Locker.instance = new Locker();
export { Locker };
