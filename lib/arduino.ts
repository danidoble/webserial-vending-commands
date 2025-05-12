import { parseToBuffer } from "./parser";

class Arduino {
  static append: string = "\n";
  static instance: Arduino;

  build(data: string) {
    return parseToBuffer(data + Arduino.append);
  }

  static connection() {
    return Arduino.instance.build("CONNECT");
  }
  static connect() {
    return Arduino.connection();
  }
  static credits() {
    return Arduino.instance.build("CREDITS");
  }
  static hi() {
    return Arduino.instance.build("HI");
  }
  static ara() {
    return Arduino.instance.build("ARA");
  }
  static custom(data: string) {
    return Arduino.instance.build(data);
  }
}

Arduino.instance = new Arduino();
export { Arduino };
