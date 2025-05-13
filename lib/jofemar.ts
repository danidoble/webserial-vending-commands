import { parseToBuffer, Uint8ArrayToHex } from "./parser";

type dispenseOptions = {
  machineChannel?: number;
  selection?: number | string;
  cart?: boolean;
};

type resetOptions = {
  machineChannel?: number;
  type?: "soldOut" | "waiting" | "machine";
};

type programOptions = {
  machineChannel?: number;
  param1?: number;
  param2?: number;
};

type programDisplayLanguageOptions = {
  machineChannel?: number;
  language?: "spanish" | "english" | "french";
};

type programWorkingTemperatureOptions = {
  machineChannel?: number;
  degrees?: number;
  machineType?: "esplus" | "iceplus";
};

type programElevatorSpeedOptions = {
  machineChannel?: number;
  speed?: "high" | "low";
};

type programTemperatureScaleOptions = {
  machineChannel?: number;
  scale?: "celsius" | "fahrenheit";
};

type displayConfigOptions = {
  machineChannel?: number;
  type?: number;
  param2?: Array<number>;
};

type sendCustomCodeOptions = {
  code?: Array<number>;
};

type eventsConfigOptions = {
  machineChannel?: number;
  event?: number | string | null;
  enable?: boolean;
};

type eventEnableOptions = {
  machineChannel?: number;
  event?: number | string | null;
};

class Jofemar {
  static asHex: boolean = false;
  static instance: Jofemar;

  build(data: Array<number>): Uint8Array | Array<string> | string {
    const withCheckSum = this.jofemarCheckSum(data);
    if (!Jofemar.asHex) return parseToBuffer(withCheckSum);

    return Uint8ArrayToHex({
      data: new Uint8Array(withCheckSum),
      asString: false,
    });
  }

  calcCheckSums(val: number) {
    const checksum = [];
    checksum.push((val & 0xff) | 0xf0);
    checksum.push((val & 0xff) | 0x0f);
    return checksum;
  }

  jofemarCheckSum(bytes: Array<number>): Uint8Array {
    let dec = 0;
    for (let i = 0; i < bytes.length; i++) {
      dec += bytes[i];
    }
    const checksum = this.calcCheckSums(dec);
    bytes.push(checksum[0]);
    bytes.push(checksum[1]);
    bytes.push(0x03);
    return new Uint8Array(bytes);
  }

  getTrayAndChannelBySelection(selection: number | string) {
    selection = parseInt(selection as string) + 109;
    selection = selection.toString();
    if (selection.length !== 3) {
      throw new Error("Invalid selection");
    }
    const tray = (parseInt(selection.substring(0, 2)) + 128)
      .toString(16)
      .padStart(2, "0");
    const channel = (parseInt(selection.substring(2, 3)) + 128)
      .toString(16)
      .padStart(2, "0");
    return { channel: parseInt(channel, 16), tray: parseInt(tray, 16) };
  }

  makeDisplayMessage(message = "") {
    message = message.padEnd(32, " ");
    const bytes = [];
    for (let i = 0; i < 32; i++) {
      bytes.push(message.charCodeAt(i));
    }
    return bytes;
  }

  makeTimeFormat(date: Date) {
    if (!(date instanceof Date))
      throw new Error("Invalid date, must be an instance of Date");

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().substring(2, 4);

    const formated = `${hours}:${minutes} ${day}-${month}-${year}`; // format hh:mm DD-MM-YY

    const bytes = [];
    for (let i = 0; i < 14; i++) {
      bytes.push(formated.charCodeAt(i));
    }
    return bytes;
  }

  static connection({ channel = 1 } = {}): Uint8Array | Array<string> | string {
    return Jofemar.instance.build([
      0x02,
      0x30,
      0x30,
      128 + channel,
      0x53,
      0xff,
      0xff,
    ]);
  }

  static dispense(
    { machineChannel = 1, selection = 1, cart = false }: dispenseOptions = {
      machineChannel: 1,
      selection: 1,
      cart: false,
    },
  ): Uint8Array | Array<string> | string {
    selection = parseInt(selection as string);
    if (isNaN(selection) || selection < 1 || selection > 130)
      throw new Error("Invalid selection");
    const { channel, tray } =
      Jofemar.instance.getTrayAndChannelBySelection(selection);
    return Jofemar.instance.build([
      0x02,
      0x30,
      0x30,
      128 + machineChannel,
      cart ? 0x4d : 0x56,
      tray,
      channel,
    ]);
  }

  static endCartDispense({ machineChannel = 1 } = {}):
    | Uint8Array
    | Array<string>
    | string {
    return Jofemar.instance.build([
      0x02,
      0x30,
      0x30,
      128 + machineChannel,
      0x4d,
      0x80,
      0x80,
    ]);
  }

  static collect({ machineChannel = 1 } = {}):
    | Uint8Array
    | Array<string>
    | string {
    return Jofemar.instance.build([
      0x02,
      0x30,
      0x30,
      128 + machineChannel,
      0x4e,
      0xff,
      0xff,
    ]);
  }

  static reset({ machineChannel = 1, type = "soldOut" }: resetOptions = {}):
    | Uint8Array
    | Array<string>
    | string {
    let param = 0x80;
    if (type === "waiting") {
      param = 0x81;
    } else if (type === "machine") {
      param = 0xff;
    }
    return Jofemar.instance.build([
      0x02,
      0x30,
      0x30,
      128 + machineChannel,
      0x52,
      param,
      0xff,
    ]);
  }

  static status({ machineChannel = 1 } = {}):
    | Uint8Array
    | Array<string>
    | string {
    return Jofemar.instance.build([
      0x02,
      0x30,
      0x30,
      128 + machineChannel,
      0x53,
      0xff,
      0xff,
    ]);
  }

  static lights({ machineChannel = 1, type = "on" } = {}):
    | Uint8Array
    | Array<string>
    | string {
    const param = type === "on" ? 0x81 : 0x80;
    return Jofemar.instance.build([
      0x02,
      0x30,
      0x30,
      128 + machineChannel,
      0x4c,
      param,
      0xff,
    ]);
  }

  static program({
    machineChannel = 1,
    param1 = 255,
    param2 = 255,
  }: programOptions = {}): Uint8Array | Array<string> | string {
    return Jofemar.instance.build([
      0x02,
      0x30,
      0x30,
      128 + machineChannel,
      0x50,
      param1,
      param2,
    ]);
  }

  static programDisplayLanguage({
    machineChannel = 1,
    language = "spanish",
  }: programDisplayLanguageOptions = {}): Uint8Array | Array<string> | string {
    const languages = { spanish: 0x30, english: 0x31, french: 0x32 };
    if (!languages[language]) throw new Error("Invalid language");
    return Jofemar.program({
      machineChannel,
      param1: 0x49,
      param2: languages[language],
    });
  }

  static programBeeper({
    machineChannel = 1,
    enable = true,
  }): Uint8Array | Array<string> | string {
    return Jofemar.program({
      machineChannel,
      param1: 0x5a,
      param2: enable ? 0x31 : 0x30,
    });
  }

  static programDisableWorkingTemperature({
    machineChannel = 1,
  }): Uint8Array | Array<string> | string {
    return Jofemar.program({
      machineChannel,
      param1: 0x54,
      param2: 0x80,
    });
  }

  static programDisableThermometer({
    machineChannel = 1,
  }): Uint8Array | Array<string> | string {
    return Jofemar.programDisableWorkingTemperature({ machineChannel });
  }

  static programWorkingTemperature({
    machineChannel = 1,
    degrees = 0.5,
    machineType = "esplus",
  }: programWorkingTemperatureOptions = {}):
    | Uint8Array
    | Array<string>
    | string {
    if (typeof degrees === "string") {
      degrees = parseFloat(degrees);
    }
    const limit = machineType === "iceplus" ? 6.5 : 32;
    const min = machineType === "iceplus" ? -25 : 0.5;
    if (
      isNaN(degrees) ||
      degrees < min ||
      degrees > limit ||
      degrees % 0.5 !== 0
    ) {
      throw new Error(
        "Invalid degrees, must be a multiple of 0.5 and between 0.5 and 32",
      );
    }

    let temp = degrees * 2 + 128;
    if (machineType === "iceplus") {
      temp += 51;
    }
    temp = Math.ceil(temp);
    return Jofemar.program({ param1: 0x54, param2: temp, machineChannel });
  }

  static programIsolationTray({
    machineChannel = 1,
    tray = 0,
  }): Uint8Array | Array<string> | string {
    if (typeof tray === "string") {
      tray = parseInt(tray);
    }
    if (isNaN(tray) || tray < 0 || tray > 12)
      throw new Error("Invalid tray, valid range is 0 to 12");

    const value = tray === 0 ? 0x80 : tray + 139;
    return Jofemar.program({ param1: 0x42, param2: value, machineChannel });
  }

  static programTimeToStandbyAfterCollect({
    machineChannel = 1,
    seconds = 15,
  } = {}): Uint8Array | Array<string> | string {
    if (typeof seconds === "string") {
      seconds = parseInt(seconds);
    }
    if (isNaN(seconds) || seconds < 15 || seconds > 120)
      throw new Error("Invalid seconds, valid range is 15 to 120");
    const value = 128 + seconds;
    return Jofemar.program({ param1: 0x46, param2: value, machineChannel });
  }

  static programTimeToStandbyWithoutCollect({
    machineChannel = 1,
    minutes = 1,
  } = {}): Uint8Array | Array<string> | string {
    if (typeof minutes === "string") {
      minutes = parseInt(minutes);
    }
    if (isNaN(minutes) || minutes < 1 || minutes > 10)
      throw new Error("Invalid minutes, valid range is 1 to 10");
    const value = 128 + minutes;
    return Jofemar.program({ param1: 0x48, param2: value, machineChannel });
  }

  static programElevatorSpeed({
    machineChannel = 1,
    speed = "high",
  }: programElevatorSpeedOptions = {}): Uint8Array | Array<string> | string {
    const speeds = { high: 0x31, low: 0x30 };
    if (!speeds[speed])
      throw new Error(`Invalid speed, valid speeds are 'high' and 'low'`);
    return Jofemar.program({
      param1: 0x76,
      param2: speeds[speed],
      machineChannel,
    });
  }

  static programTemperatureExpiration({
    machineChannel = 1,
    enable = false,
  }): Uint8Array | Array<string> | string {
    return Jofemar.program({
      machineChannel,
      param1: 0x63,
      param2: enable ? 0x31 : 0x30,
    });
  }

  static programMachineAddress({
    machineChannel = 1,
    address = 1,
  }): Uint8Array | Array<string> | string {
    if (typeof address === "string") {
      address = parseInt(address);
    }
    if (isNaN(address) || address < 1 || address > 31)
      throw new Error("Invalid address, valid range is 1 to 31");
    return Jofemar.program({
      param1: 0x64,
      param2: 128 + address,
      machineChannel,
    });
  }

  static programTemperatureBeforeExpiration({
    machineChannel = 1,
    degrees = 0.5,
  }): Uint8Array | Array<string> | string {
    if (typeof degrees === "string") {
      degrees = parseFloat(degrees);
    }
    if (isNaN(degrees) || degrees < 0.5 || degrees > 30 || degrees % 0.5 !== 0)
      throw new Error(
        "Invalid degrees, must be a multiple of 0.5 and valid range is 0.5 to 30",
      );
    const value = 128 + degrees * 2;
    return Jofemar.program({ param1: 0x65, param2: value, machineChannel });
  }

  static programTimeBeforeExpirationByTemperature({
    machineChannel = 1,
    minutes = 1,
  }): Uint8Array | Array<string> | string {
    if (typeof minutes === "string") {
      minutes = parseInt(minutes);
    }
    if (isNaN(minutes) || minutes < 1 || minutes > 120)
      throw new Error("Invalid minutes, valid range is 1 to 120");
    const value = 128 + minutes;
    return Jofemar.program({ param1: 0x66, param2: value, machineChannel });
  }

  static programTemperatureScale({
    machineChannel = 1,
    scale = "celsius",
  }: programTemperatureScaleOptions = {}): Uint8Array | Array<string> | string {
    const scales = { celsius: 0x43, fahrenheit: 0x46 };
    if (!scales[scale])
      throw new Error(
        `Invalid scale, valid scales are 'celsius' and 'fahrenheit'`,
      );
    return Jofemar.program({
      param1: 0x67,
      param2: scales[scale],
      machineChannel,
    });
  }

  static programVoltageEngine({
    machineChannel = 1,
    selection = 1,
    voltage = 5,
  } = {}): Uint8Array | Array<string> | string {
    if (typeof voltage === "string") {
      voltage = parseFloat(voltage);
    }
    if (typeof selection === "string") {
      selection = parseInt(selection);
    }
    if (isNaN(selection) || selection < 1 || selection > 130) {
      throw new Error(`Invalid selection, valid range is 1 to 130`);
    }
    if (isNaN(voltage) || voltage < 5 || voltage > 9.5 || voltage % 0.5 !== 0) {
      throw new Error("Invalid voltage, valid range is 5 to 9.5");
    }

    const param1 = 109 + selection;
    const aux = voltage - 5;
    const param2 = 128 + aux * 2;

    return Jofemar.instance.build([
      0x02,
      0x30,
      0x30,
      128 + machineChannel,
      0x47,
      param1,
      param2,
    ]);
  }

  static programPushOverProducts({
    machineChannel = 1,
    selection = 1,
    enable = true,
  } = {}): Uint8Array | Array<string> | string {
    if (typeof selection === "string") {
      selection = parseInt(selection);
    }
    if (isNaN(selection) || selection < 1 || selection > 130)
      throw new Error(`Invalid selection, valid range is 1 to 130`);
    const param1 = 109 + selection;
    const param2 = enable ? 0x31 : 0x30;
    return Jofemar.instance.build([
      0x02,
      0x30,
      0x30,
      128 + machineChannel,
      0x4f,
      param1,
      param2,
    ]);
  }

  static programChannelRunningAfterDispense({
    machineChannel = 1,
    selection = 1,
    seconds = 0,
  } = {}): Uint8Array | Array<string> | string {
    if (typeof selection === "string") {
      selection = parseInt(selection);
    }
    if (typeof seconds === "string") {
      seconds = parseFloat(seconds);
    }
    if (isNaN(selection) || selection < 1 || selection > 130)
      throw new Error(`Invalid selection, valid range is 1 to 130`);
    if (isNaN(seconds) || seconds < 0 || seconds > 10 || seconds % 0.1 !== 0)
      throw new Error(
        "Invalid seconds, valid range is 0.0 to 10.0 with a step of 0.1",
      );
    const param1 = 109 + selection;

    seconds = 10 * parseFloat(seconds.toFixed(1));
    // each decimal sum one in hex, ex: 0.0 = 0x80, 0.2 = 0x82, 0.9 = 0x89, etc. until 10.0 = 0xe4
    const param2 = 128 + seconds;
    return Jofemar.instance.build([
      0x02,
      0x30,
      0x30,
      128 + machineChannel,
      0x45,
      param1,
      param2,
    ]);
  }

  static checkData({
    machineChannel = 1,
    type = 0xff,
    aux = 0xff,
  }): Uint8Array | Array<string> | string {
    return Jofemar.instance.build([
      0x02,
      0x30,
      0x30,
      128 + machineChannel,
      0x43,
      type,
      aux,
    ]);
  }

  static getDisplayLanguage({
    machineChannel = 1,
  }): Uint8Array | Array<string> | string {
    return Jofemar.checkData({ machineChannel, type: 0x49 });
  }

  static getBeeper({
    machineChannel = 1,
  }): Uint8Array | Array<string> | string {
    return Jofemar.checkData({ machineChannel, type: 0x5a });
  }

  static getWorkingTemperature({
    machineChannel = 1,
  }): Uint8Array | Array<string> | string {
    return Jofemar.checkData({ machineChannel, type: 0x54 });
  }

  static getIsolationTray({
    machineChannel = 1,
  }): Uint8Array | Array<string> | string {
    return Jofemar.checkData({ machineChannel, type: 0x42 });
  }

  static getProgramVersion({
    machineChannel = 1,
  }): Uint8Array | Array<string> | string {
    return Jofemar.checkData({ machineChannel, type: 0x50 });
  }

  static getFaults({
    machineChannel = 1,
  }): Uint8Array | Array<string> | string {
    return Jofemar.checkData({ machineChannel, type: 0x53 });
  }

  static getMachineId({
    machineChannel = 1,
  }): Uint8Array | Array<string> | string {
    return Jofemar.checkData({ machineChannel, type: 0x4e });
  }

  static getCurrentTemperature({
    machineChannel = 1,
  }): Uint8Array | Array<string> | string {
    return Jofemar.checkData({ machineChannel, type: 0x74 });
  }

  static getTimeToStandbyAfterCollect({
    machineChannel = 1,
  }): Uint8Array | Array<string> | string {
    return Jofemar.checkData({ machineChannel, type: 0x46 });
  }

  static getTimeToStandbyWithoutCollect({
    machineChannel = 1,
  }): Uint8Array | Array<string> | string {
    return Jofemar.checkData({ machineChannel, type: 0x48 });
  }

  static getElevatorSpeed({
    machineChannel = 1,
  }): Uint8Array | Array<string> | string {
    return Jofemar.checkData({ machineChannel, type: 0x76 });
  }

  static getTemperatureExpiration({
    machineChannel = 1,
  }): Uint8Array | Array<string> | string {
    return Jofemar.checkData({ machineChannel, type: 0x63 });
  }

  static getTemperatureBeforeExpiration({
    machineChannel = 1,
  }): Uint8Array | Array<string> | string {
    return Jofemar.checkData({ machineChannel, type: 0x65 });
  }

  static getTimeBeforeExpirationByTemperature({
    machineChannel = 1,
  }): Uint8Array | Array<string> | string {
    return Jofemar.checkData({ machineChannel, type: 0x66 });
  }

  static getTemperatureScale({
    machineChannel = 1,
  }): Uint8Array | Array<string> | string {
    return Jofemar.checkData({ machineChannel, type: 0x67 });
  }

  static getClockRegisters({
    machineChannel = 1,
  }): Uint8Array | Array<string> | string {
    return Jofemar.checkData({ machineChannel, type: 0x72 });
  }

  static getMachineActivity({
    machineChannel = 1,
  }): Uint8Array | Array<string> | string {
    return Jofemar.checkData({ machineChannel, type: 0x41 });
  }

  static getVoltageEngine({
    machineChannel = 1,
    selection = 1,
  }): Uint8Array | Array<string> | string {
    if (typeof selection === "string") {
      selection = parseInt(selection);
    }
    if (isNaN(selection) || selection < 1 || selection > 130) {
      throw new Error("Invalid selection, valid range is 1 to 130");
    }
    return Jofemar.checkData({
      machineChannel,
      type: 0x47,
      aux: 109 + selection,
    });
  }

  static getChannelPresence({ machineChannel = 1, selection = 1 } = {}):
    | Uint8Array
    | Array<string>
    | string {
    if (typeof selection === "string") {
      selection = parseInt(selection);
    }
    if (isNaN(selection) || selection < 1 || selection > 130) {
      throw new Error("Invalid selection, valid range is 1 to 130");
    }
    return Jofemar.checkData({
      machineChannel,
      type: 0x43,
      aux: 109 + selection,
    });
  }

  static getPushOverProducts({ machineChannel = 1, selection = 1 } = {}):
    | Uint8Array
    | Array<string>
    | string {
    if (typeof selection === "string") {
      selection = parseInt(selection);
    }
    if (isNaN(selection) || selection < 1 || selection > 130) {
      throw new Error("Invalid selection, valid range is 1 to 130");
    }

    return Jofemar.checkData({
      machineChannel,
      type: 0x4f,
      aux: 109 + selection,
    });
  }

  static getChannelRunningAfterDispense({
    machineChannel = 1,
    selection = 1,
  } = {}): Uint8Array | Array<string> | string {
    if (typeof selection === "string") {
      selection = parseInt(selection);
    }
    if (isNaN(selection) || selection < 1 || selection > 130) {
      throw new Error("Invalid selection, valid range is 1 to 130");
    }
    return Jofemar.checkData({
      machineChannel,
      type: 0x45,
      aux: 109 + selection,
    });
  }

  static displayConfig({
    machineChannel = 1,
    type = 0x80,
    param2 = [],
  }: displayConfigOptions = {}): Uint8Array | Array<string> | string {
    return Jofemar.instance.build([
      0x02,
      0x30,
      0x30,
      128 + machineChannel,
      0x44,
      type,
      ...param2,
    ]);
  }

  static setDisplayStandbyMessage({ machineChannel = 1, message = "" } = {}):
    | Uint8Array
    | Array<string>
    | string {
    message = message.substring(0, 32);
    const bytes = Jofemar.instance.makeDisplayMessage(message);
    return Jofemar.displayConfig({
      machineChannel,
      type: 0x80,
      param2: bytes,
    });
  }
  static setDisplayMessageTemporarily({
    machineChannel = 1,
    message = "",
    seconds = 1,
  }): Uint8Array | Array<string> | string {
    message = message.substring(0, 32);
    if (typeof seconds === "string") {
      seconds = parseInt(seconds);
    }
    if (isNaN(seconds) || seconds < 1 || seconds > 125)
      throw new Error("Invalid seconds, valid range is 1 to 125");
    const bytes = Jofemar.instance.makeDisplayMessage(message);
    const time = 128 + seconds;
    return Jofemar.displayConfig({
      machineChannel,
      type: time,
      param2: bytes,
    });
  }

  static setDisplayMessageUnlimited({
    machineChannel = 1,
    message = "",
  }): Uint8Array | Array<string> | string {
    message = message.substring(0, 32);
    const bytes = Jofemar.instance.makeDisplayMessage(message);
    return Jofemar.displayConfig({
      machineChannel,
      type: 0xff,
      param2: bytes,
    });
  }

  static programClock({ machineChannel = 1, date = new Date() } = {}):
    | Uint8Array
    | Array<string>
    | string {
    if (!(date instanceof Date)) {
      throw new Error("Invalid date, must be an instance of Date");
    }

    return Jofemar.instance.build([
      0x02,
      0x30,
      0x30,
      128 + machineChannel,
      0x72,
      ...Jofemar.instance.makeTimeFormat(date),
    ]);
  }

  static eventsConfig({
    machineChannel = 1,
    event = null,
    enable = true,
  }: eventsConfigOptions = {}): Uint8Array | Array<string> | string {
    if (null === event) throw new Error("Invalid event");
    const value = enable ? 0x31 : 0x30;
    return Jofemar.instance.build([
      0x02,
      0x30,
      0x30,
      128 + machineChannel,
      0x41,
      event as number,
      value,
    ]);
  }

  static eventEnable({
    machineChannel = 1,
    event = null,
  }: eventEnableOptions = {}): Uint8Array | Array<string> | string {
    if (null === event) throw new Error("Invalid event");
    const decimal = parseInt(event as string, 16);
    if (isNaN(decimal) || decimal < 38 || decimal > 100) {
      throw new Error("Invalid event");
    }
    return Jofemar.eventsConfig({ machineChannel, event, enable: true });
  }

  static eventDisable({
    machineChannel = 1,
    event = null,
  }: eventEnableOptions = {}): Uint8Array | Array<string> | string {
    if (null === event) throw new Error("Invalid event");
    const decimal = parseInt(event as string, 16);
    if (isNaN(decimal) || decimal < 38 || decimal > 100)
      throw new Error("Invalid event");
    return Jofemar.eventsConfig({ machineChannel, event, enable: false });
  }

  static sendCustomCode({ code = [] }: sendCustomCodeOptions = {}):
    | Uint8Array
    | Array<string>
    | string {
    if (code.length < 5) throw new Error("Invalid code, minimum length is 5");
    return Jofemar.instance.build(code);
  }
}

Jofemar.instance = new Jofemar();
export { Jofemar };
