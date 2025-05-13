import { parseToBuffer } from "./parser";

type makeSaleOptions = {
  amount?: number;
  reference?: string | null;
};

type getVoucherOptions = {
  folio?: number | string | null;
};

type refundOptions = {
  amount?: number;
  folio?: number | string | null;
  auth?: number | string | null;
};

class PinPax {
  static append: string = "\r\n";
  static instance: PinPax;

  build(data: string) {
    return parseToBuffer(data + PinPax.append);
  }

  static connection(): Uint8Array {
    const data = JSON.stringify({ action: "CONNECT" });
    return PinPax.instance.build(data);
  }
  static connect(): Uint8Array {
    return PinPax.connection();
  }

  static custom(str: string): Uint8Array {
    if (typeof str !== "string") throw new Error("Invalid string");
    return PinPax.instance.build(str);
  }

  static readQR(
    { type = "production" } = {
      type: "production",
    },
  ): Uint8Array {
    const data = JSON.stringify({
      action: "READQR",
      server: type === "production" ? "PROD" : "QA",
    });
    return PinPax.instance.build(data);
  }

  static forceHide(): Uint8Array {
    const data = JSON.stringify({ action: "FORCEHIDE" });
    return PinPax.instance.build(data);
  }

  static forceShow(): Uint8Array {
    const data = JSON.stringify({ action: "FORCESHOW" });
    return PinPax.instance.build(data);
  }

  static makeSale({
    amount = 0,
    reference = null,
  }: makeSaleOptions = {}): Uint8Array {
    if (amount <= 0) throw new Error("Invalid amount");
    if (typeof amount !== "number") {
      amount = parseFloat(amount);
    }
    if (isNaN(amount)) throw new Error("Invalid amount");
    if (reference && !/^[A-Z-a-z0-9_\s]+$/g.test(reference)) {
      throw new Error(
        "Reference must be alphanumeric and the only symbol allowed is midlescore or underscore (- _) or null",
      );
    }

    const amountStr = amount.toFixed(2);
    const data = JSON.stringify({
      action: "PAYMENT",
      amount: amountStr,
      reference: reference,
    });
    return PinPax.instance.build(data);
  }

  static getVoucher({ folio = null }: getVoucherOptions = {}): Uint8Array {
    if (!folio) {
      throw new Error("Folio must be a number");
    }
    const data = JSON.stringify({ action: "GETVOUCHER", folio });
    return PinPax.instance.build(data);
  }

  static info(): Uint8Array {
    const data = JSON.stringify({ action: "DEVICEINFO" });
    return PinPax.instance.build(data);
  }

  static keepAlive(): Uint8Array {
    const data = JSON.stringify({ action: "KEEPALIVE" });
    return PinPax.instance.build(data);
  }

  static restartApp(): Uint8Array {
    const data = JSON.stringify({ action: "RESETAPP" });
    return PinPax.instance.build(data);
  }

  static getConfig(): Uint8Array {
    const data = JSON.stringify({ action: "GETCONFIG" });
    return PinPax.instance.build(data);
  }

  static hideButtons(): Uint8Array {
    const data = JSON.stringify({ action: "HIDEBUTTONS" });
    return PinPax.instance.build(data);
  }

  static showButtons(): Uint8Array {
    const data = JSON.stringify({ action: "SHOWBUTTONS" });
    return PinPax.instance.build(data);
  }

  static demo(): Uint8Array {
    const data = JSON.stringify({ action: "DEMO" });
    return PinPax.instance.build(data);
  }

  static refund({
    amount = 0,
    folio = null,
    auth = null,
  }: refundOptions = {}): Uint8Array {
    if (amount <= 0) throw new Error("Invalid amount");
    if (typeof amount !== "number") {
      amount = parseFloat(amount);
    }
    if (isNaN(amount)) throw new Error("Invalid amount");
    if (!folio) throw new Error("Folio must be a number");
    if (!auth) throw new Error("Auth must be a number");

    const amountStr = amount.toFixed(2);

    const data = JSON.stringify({
      action: "REFUND",
      amount: amountStr,
      folio,
      auth,
    });
    return PinPax.instance.build(data);
  }

  static exit(): Uint8Array {
    const data = JSON.stringify({ action: "EXIT" });
    return PinPax.instance.build(data);
  }

  static init(): Uint8Array {
    const data = JSON.stringify({ action: "INIT" });
    return PinPax.instance.build(data);
  }
}

PinPax.instance = new PinPax();
export { PinPax };
