import { parseToBuffer, Uint8ArrayToHex } from "./parser";

type banknotePurseSaveMemoryOptions = {
  channel: null | number;
  $20: null | number;
  $50: null | number;
  $100: null | number;
  $200: null | number;
  $500: null | number;
  $1000: null | number;
};

type cardReaderDispenseOptions = {
  selection: number;
  second_selection?: null | number;
  sensor?: boolean;
  seconds?: null | number;
  price: number;
};

type dispenseOptions = {
  selection: number;
  second_selection?: null | number;
  sensor?: boolean;
  seconds?: null | number;
};

class Boardroid {
  static asHex: boolean = false;
  static instance: Boardroid;

  build(data: Uint8Array): Uint8Array | Array<string> | string {
    if (!Boardroid.asHex) return parseToBuffer(data);

    return Uint8ArrayToHex({ data, asString: false });
  }

  serialBoardroidSumHex(arr: Uint8Array): number {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      if (i === 0 || i === 11) continue;
      sum += arr[i];
    }
    return sum;
  }

  boardroidCheckSum(bytes: Uint8Array): Uint8Array {
    bytes[11] = this.serialBoardroidSumHex(bytes);
    return bytes;
  }

  static connection({ channel = 1 } = {}): Uint8Array | Array<string> | string {
    const arr = Boardroid.instance.boardroidCheckSum(
      new Uint8Array([
        0xf1,
        0x05 + channel,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0xf2,
        0xf8,
      ]),
    );

    return Boardroid.instance.build(arr);
  }

  static coinPurseConfiguration({
    enable = false,
    high = 255,
    low = 255,
  } = {}): Uint8Array | Array<string> | string {
    const arr = Boardroid.instance.boardroidCheckSum(
      new Uint8Array([
        0xf1,
        0xc1,
        enable ? 0x01 : 0x00,
        high,
        low,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0xf2,
        0x00,
      ]),
    );

    return Boardroid.instance.build(arr);
  }

  static coinPurseDispense({ $50c = 0, $1 = 0, $2 = 0, $5 = 0, $10 = 0 } = {}):
    | Uint8Array
    | Array<string>
    | string {
    if (
      [$50c, $1, $2, $5, $10].some(
        (value) => isNaN(value) || typeof value === "string",
      )
    ) {
      throw new Error("One of the values is not a number");
    }
    if ($50c < 1 && $1 < 1 && $2 < 1 && $5 < 1 && $10 < 1)
      throw new Error("No coins to dispense");

    const arr = Boardroid.instance.boardroidCheckSum(
      new Uint8Array([
        0xf1,
        0xc6,
        $50c,
        $1,
        $2,
        $5,
        $10,
        0x00,
        0x00,
        0x00,
        0xf2,
        0x00,
      ]),
    );

    return Boardroid.instance.build(arr);
  }

  static coinPurseReadTubes(): Uint8Array | Array<string> | string {
    const arr = Boardroid.instance.boardroidCheckSum(
      new Uint8Array([
        0xf1, 0xc2, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf2, 0x00,
      ]),
    );

    return Boardroid.instance.build(arr);
  }

  static banknotePurseICTConfigure({ enable = false, scrow = false } = {}):
    | Uint8Array
    | Array<string>
    | string {
    const txStatus = enable ? 0xff : 0x00;
    const txScrow = scrow ? 0xff : 0x00;
    const arr = Boardroid.instance.boardroidCheckSum(
      new Uint8Array([
        0xf1,
        0xc0,
        txStatus,
        txStatus,
        txScrow,
        txScrow,
        0x00,
        0x00,
        0x00,
        0x00,
        0xf2,
        0x00,
      ]),
    );
    return Boardroid.instance.build(arr);
  }

  static banknotePurseOtherConfigure({ enable = false, scrow = false } = {}):
    | Uint8Array
    | Array<string>
    | string {
    const txStatus = enable ? 0x01 : 0x00;
    const txScrow = scrow ? 0x01 : 0x00;
    const arr = Boardroid.instance.boardroidCheckSum(
      new Uint8Array([
        0xf1,
        0xc0,
        txStatus,
        txScrow,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0xf2,
        0x00,
      ]),
    );
    return Boardroid.instance.build(arr);
  }

  static banknotePurseICTDispense({
    quantity = 1,
    denomination = 20,
  }): Uint8Array | Array<string> | string {
    if (quantity < 1) {
      throw new Error("No banknotes to dispense");
    }
    // must be 20, 50, 100, 200, 500
    if ([20, 50, 100, 200, 500].indexOf(denomination) === -1) {
      throw new Error("Invalid denomination");
    }
    //currency => 0: $20, 1: $50, 2: $100, 3: $200, 4: $500
    const currency = [20, 50, 100, 200, 500].indexOf(denomination);
    const arr = Boardroid.instance.boardroidCheckSum(
      new Uint8Array([
        0xf1,
        0xc5,
        currency,
        quantity,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0xf2,
        0x00,
      ]),
    );
    return Boardroid.instance.build(arr);
  }

  static banknotePurseOtherDispense({
    $20 = 0,
    $50 = 0,
    $100 = 0,
    $200 = 0,
    $500 = 0,
    $1000 = 0,
  } = {}): Uint8Array | Array<string> | string {
    if (
      [$20, $50, $100, $200, $500, $1000].some(
        (value) => isNaN(value) || typeof value === "string",
      )
    ) {
      throw new Error("One of the values is not a number");
    }
    if ($20 < 1 && $50 < 1 && $100 < 1 && $200 < 1 && $500 < 1 && $1000 < 1)
      throw new Error("No banknotes to dispense");
    const arr = Boardroid.instance.boardroidCheckSum(
      new Uint8Array([
        0xf1,
        0xc5,
        $20,
        $50,
        $100,
        $200,
        $500,
        $1000,
        0x00,
        0x00,
        0xf2,
        0x00,
      ]),
    );
    return Boardroid.instance.build(arr);
  }

  static banknotePurseAcceptInScrow(): Uint8Array | Array<string> | string {
    const arr = Boardroid.instance.boardroidCheckSum(
      new Uint8Array([
        0xf1, 0xc4, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf2, 0x00,
      ]),
    );
    return Boardroid.instance.build(arr);
  }

  static banknotePurseRejectInScrow(): Uint8Array | Array<string> | string {
    const arr = Boardroid.instance.boardroidCheckSum(
      new Uint8Array([
        0xf1, 0xc4, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf2, 0x00,
      ]),
    );
    return Boardroid.instance.build(arr);
  }

  static banknotePurseSaveMemory(
    {
      channel = null,
      $20 = null,
      $50 = null,
      $100 = null,
      $200 = null,
      $500 = null,
      $1000 = null,
    }: banknotePurseSaveMemoryOptions = {
      channel: null,
      $20: null,
      $50: null,
      $100: null,
      $200: null,
      $500: null,
      $1000: null,
    },
  ): Uint8Array | Array<string> | string {
    if (
      channel === null ||
      $20 === null ||
      $50 === null ||
      $100 === null ||
      $200 === null ||
      $500 === null ||
      $1000 === null
    ) {
      throw new Error(
        "One of the values is not defined: " +
          JSON.stringify({
            channel,
            $20,
            $50,
            $100,
            $200,
            $500,
            $1000,
          }),
      );
    }
    const arr = Boardroid.instance.boardroidCheckSum(
      new Uint8Array([
        0xf1,
        0xc8,
        channel,
        0x00,
        $20,
        $50,
        $100,
        $200,
        $500,
        $1000,
        0xf2,
        0x00,
      ]),
    );
    return Boardroid.instance.build(arr);
  }

  static banknotePurseReadRecycler(): Uint8Array | Array<string> | string {
    const arr = Boardroid.instance.boardroidCheckSum(
      new Uint8Array([
        0xf1, 0xc3, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf2, 0xb5,
      ]),
    );
    return Boardroid.instance.build(arr);
  }

  static cardReaderDisable(): Uint8Array | Array<string> | string {
    const arr = Boardroid.instance.boardroidCheckSum(
      new Uint8Array([
        0xf1, 0xcd, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf2, 0x00,
      ]),
    );
    return Boardroid.instance.build(arr);
  }

  static cardReaderDispense(
    {
      selection = 1,
      second_selection = null,
      sensor = true,
      seconds = null,
      price = 0,
    }: cardReaderDispenseOptions = {
      selection: 1,
      second_selection: null,
      sensor: true,
      seconds: null,
      price: 0,
    },
  ): Uint8Array | Array<string> | string {
    // get high and low from price, 8 bits each
    const high = price / 256;
    const low = price % 256;

    const __channel = selection + 9;
    let __second_channel = 0x00;
    if (second_selection) {
      __second_channel = second_selection + 9;
    }

    let __type = 0x00;
    if (!sensor) {
      if (!seconds) {
        seconds = 1.5;
      }
      // A = 1.5 seconds

      __type = Math.round(seconds * 6.2);
    }

    const arr = Boardroid.instance.boardroidCheckSum(
      new Uint8Array([
        0xf1,
        0xcd,
        0x01,
        __channel,
        __second_channel,
        __type,
        high,
        low,
        0x00,
        0x00,
        0xf2,
        0x00,
      ]),
    );
    return Boardroid.instance.build(arr);
  }

  static coolingRelayConfigure({ enable = true } = {}):
    | Uint8Array
    | Array<string>
    | string {
    const arr = Boardroid.instance.boardroidCheckSum(
      new Uint8Array([
        0xf1,
        0xcc,
        enable ? 0x01 : 0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0xf2,
        0x00,
      ]),
    );
    return Boardroid.instance.build(arr);
  }

  static readTemperature(): Uint8Array | Array<string> | string {
    const arr = Boardroid.instance.boardroidCheckSum(
      new Uint8Array([
        0xf1, 0xcb, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf2, 0x00,
      ]),
    );
    return Boardroid.instance.build(arr);
  }

  static dispense(
    {
      selection = 1,
      second_selection = null,
      sensor = true,
      seconds = null,
    }: dispenseOptions = {
      selection: 1,
      second_selection: null,
      sensor: true,
      seconds: null,
    },
  ): Uint8Array | Array<string> | string {
    selection += 9;
    const __channel1 = selection;

    let __channel2 = 0x00;
    if (second_selection) {
      second_selection += 9;
      __channel2 = second_selection;
    }

    let __type = 0x00;
    if (!sensor) {
      if (!seconds) {
        seconds = 1.5;
      }
      // A = 1.5 seconds

      __type = Math.round(seconds * 6.2);
    }

    const arr = Boardroid.instance.boardroidCheckSum(
      new Uint8Array([
        0xf1,
        0xc7,
        __channel1,
        __channel2,
        __type,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0xf2,
        0x00,
      ]),
    );
    return Boardroid.instance.build(arr);
  }

  static customCode(
    code: Array<number | string>,
  ): Uint8Array | Array<string> | string {
    if (typeof code[0] === "string") {
      code = code.map((item) => parseInt(item as string, 16));
    }
    const arr = Boardroid.instance.boardroidCheckSum(
      new Uint8Array(code as number[]),
    );
    return Boardroid.instance.build(arr);
  }
}

Boardroid.instance = new Boardroid();
export { Boardroid };
