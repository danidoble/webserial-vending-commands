import { Arduino } from "./arduino";
import { Boardroid } from "./boardroid";
import { Jofemar } from "./jofemar";
import { Locker } from "./locker";
// import { PinPad } from "./pinpad";
import { PinPax } from "./pinpax";
import { Relay } from "./relay";

import {
  hexToUint8Array,
  parseToBuffer,
  Uint8ArrayToHex,
  Uint8ArrayToString,
} from "./parser";

// Jofemar
// const printAsFormat = (data: Uint8Array | Array<string> | string) => {
//   if (data instanceof Uint8Array) {
//     console.log(data, Uint8ArrayToHex({ data, asString: false }));
//   } else if (Array.isArray(data)) {
//     console.log(data, hexToUint8Array(data));
//   } else if (typeof data === "string") {
//     console.log(data);
//   }
// };
// const connection = Jofemar.connection({ channel: 1 });
// const dispense = Jofemar.dispense({ machineChannel: 1, selection: 1 });
// const dispenseCart = Jofemar.dispense({ machineChannel: 1, selection: 1, cart: true });
// const endCartDispense = Jofemar.endCartDispense({ machineChannel: 2 });
// const collect = Jofemar.collect({ machineChannel: 1 });
// const resetSoldOut = Jofemar.reset({ machineChannel: 1, type: "soldOut" });
// const resetWaiting = Jofemar.reset({ machineChannel: 1, type: "waiting" });
// const resetMachine = Jofemar.reset({ machineChannel: 1, type: "machine" });
// const status = Jofemar.status({ machineChannel: 1 });
// const lightsOn = Jofemar.lights({ machineChannel: 1, type: "on" });
// const lightsOff = Jofemar.lights({ machineChannel: 1, type: "off" });
// const programDisplayLanguage = Jofemar.programDisplayLanguage({machineChannel: 1,});
// const programBeeper = Jofemar.programBeeper({machineChannel: 1,});
// const programDisableWorkingTemperature = Jofemar.programDisableWorkingTemperature({machineChannel: 1, });
// const programDisableThermometer = Jofemar.programDisableThermometer({machineChannel: 1,});
// const programWorkingTemperature = Jofemar.programWorkingTemperature({machineChannel: 1, degrees: 4});
// const programIsolationTray = Jofemar.programIsolationTray({machineChannel: 1, tray: 0});
// const programTimeToStandbyAfterCollect = Jofemar.programTimeToStandbyAfterCollect({machineChannel: 1, seconds: 20});
// const programTimeToStandbyWithoutCollect = Jofemar.programTimeToStandbyWithoutCollect({machineChannel: 1, minutes: 2});
// const programElevatorSpeed = Jofemar.programElevatorSpeed({machineChannel: 1, speed: 'high'});
// const programTemperatureExpiration = Jofemar.programTemperatureExpiration({machineChannel: 1, enable: true});
// const programMachineAddress = Jofemar.programMachineAddress({machineChannel: 1, address: 1});
// const programTemperatureBeforeExpiration = Jofemar.programTemperatureBeforeExpiration({machineChannel: 1, degrees: 10});
// const programTimeBeforeExpirationByTemperature = Jofemar.programTimeBeforeExpirationByTemperature({machineChannel: 1, minutes: 5});
// const programTemperatureScale = Jofemar.programTemperatureScale({machineChannel: 1, scale: 'celsius'});
// const programVoltageEngine = Jofemar.programVoltageEngine({machineChannel: 1, voltage: 7});
// const programPushOverProducts = Jofemar.programPushOverProducts({machineChannel: 1, enable: true, selection: 1});
// const programChannelRunningAfterDispense = Jofemar.programChannelRunningAfterDispense({machineChannel: 1, selection: 1, seconds: 0});
// const getDisplayLanguage = Jofemar.getDisplayLanguage({machineChannel: 1});
// const getBeeper = Jofemar.getBeeper({machineChannel: 1});
// const getWorkingTemperature = Jofemar.getWorkingTemperature({machineChannel: 1});
// const getIsolationTray = Jofemar.getIsolationTray({machineChannel: 1});
// const getProgramVersion = Jofemar.getProgramVersion({machineChannel: 1});
// const getFaults = Jofemar.getFaults({machineChannel: 1});
// const getMachineId = Jofemar.getMachineId({machineChannel: 1});
// const getCurrentTemperature = Jofemar.getCurrentTemperature({machineChannel: 1});
// const getTimeToStandbyAfterCollect = Jofemar.getTimeToStandbyAfterCollect({machineChannel: 1});
// const getTimeToStandbyWithoutCollect = Jofemar.getTimeToStandbyWithoutCollect({machineChannel: 1});
// const getElevatorSpeed = Jofemar.getElevatorSpeed({machineChannel: 1});
// const getTemperatureExpiration = Jofemar.getTemperatureExpiration({machineChannel: 1});
// const getTemperatureBeforeExpiration = Jofemar.getTemperatureBeforeExpiration({machineChannel: 1});
// const getTimeBeforeExpirationByTemperature = Jofemar.getTimeBeforeExpirationByTemperature({machineChannel: 1});
// const getTemperatureScale = Jofemar.getTemperatureScale({machineChannel: 1});
// const getClockRegisters = Jofemar.getClockRegisters({machineChannel: 1});
// const getMachineActivity = Jofemar.getMachineActivity({machineChannel: 1});
// const getVoltageEngine = Jofemar.getVoltageEngine({machineChannel: 1, selection: 1});
// const getChannelPresence = Jofemar.getChannelPresence({machineChannel: 1, selection: 1});
// const getPushOverProducts = Jofemar.getPushOverProducts({machineChannel: 1, selection: 1});
// const getChannelRunningAfterDispense = Jofemar.getChannelRunningAfterDispense({machineChannel: 1, selection: 1});
// const setDisplayStandbyMessage = Jofemar.setDisplayStandbyMessage({machineChannel:1, message: "Hello World"});
// const setDisplayMessageTemporarily = Jofemar.setDisplayMessageTemporarily({machineChannel:1, message: "Hello World", seconds: 10});
// const setDisplayMessageUnlimited = Jofemar.setDisplayMessageUnlimited({machineChannel:1,message: "Hello World"});
// const programClock = Jofemar.programClock({machineChannel:1, date: new Date()})
// const eventEnable = Jofemar.eventEnable({machineChannel:1, event: 0x38});
// const eventDisable = Jofemar.eventDisable({machineChannel:1, event: 0x38});
// const sendCustomCode = Jofemar.sendCustomCode({ code: [0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x00]});
// // ----------------------------------------------------
// printAsFormat(connection);
// printAsFormat(dispense);
// printAsFormat(dispenseCart);
// printAsFormat(endCartDispense);
// printAsFormat(collect);
// printAsFormat(resetSoldOut);
// printAsFormat(resetWaiting);
// printAsFormat(resetMachine);
// printAsFormat(status);
// printAsFormat(lightsOn);
// printAsFormat(lightsOff);
// printAsFormat(programDisplayLanguage);
// printAsFormat(programBeeper);
// printAsFormat(programDisableWorkingTemperature);
// printAsFormat(programDisableThermometer);
// printAsFormat(programWorkingTemperature);
// printAsFormat(programIsolationTray);
// printAsFormat(programTimeToStandbyAfterCollect);
// printAsFormat(programTimeToStandbyWithoutCollect);
// printAsFormat(programElevatorSpeed);
// printAsFormat(programTemperatureExpiration);
// printAsFormat(programMachineAddress);
// printAsFormat(programTemperatureBeforeExpiration);
// printAsFormat(programTimeBeforeExpirationByTemperature);
// printAsFormat(programTemperatureScale);
// printAsFormat(programVoltageEngine);
// printAsFormat(programPushOverProducts);
// printAsFormat(programChannelRunningAfterDispense);
// printAsFormat(getDisplayLanguage);
// printAsFormat(getBeeper);
// printAsFormat(getWorkingTemperature);
// printAsFormat(getIsolationTray);
// printAsFormat(getProgramVersion);
// printAsFormat(getFaults);
// printAsFormat(getMachineId);
// printAsFormat(getCurrentTemperature);
// printAsFormat(getTimeToStandbyAfterCollect);
// printAsFormat(getTimeToStandbyWithoutCollect);
// printAsFormat(getElevatorSpeed);
// printAsFormat(getTemperatureExpiration);
// printAsFormat(getTemperatureBeforeExpiration);
// printAsFormat(getTimeBeforeExpirationByTemperature);
// printAsFormat(getTemperatureScale);
// printAsFormat(getClockRegisters);
// printAsFormat(getMachineActivity);
// printAsFormat(getVoltageEngine);
// printAsFormat(getChannelPresence);
// printAsFormat(getPushOverProducts);
// printAsFormat(getChannelRunningAfterDispense);
// printAsFormat(setDisplayStandbyMessage);
// printAsFormat(setDisplayMessageTemporarily);
// printAsFormat(setDisplayMessageUnlimited);
// printAsFormat(programClock);
// printAsFormat(eventEnable);
// printAsFormat(eventDisable);
// printAsFormat(sendCustomCode);

// Boardroid
// const printAsFormat = (data: Uint8Array | Array<string> | string) => {
//   if (data instanceof Uint8Array) {
//     console.log(data, Uint8ArrayToHex({ data, asString: false }));
//   } else if (Array.isArray(data)) {
//     console.log(data, hexToUint8Array(data));
//   } else if (typeof data === "string") {
//     console.log(data);
//   }
// };
// const connection = Boardroid.connection({ channel: 1 });
// const coinPurseEnable = Boardroid.coinPurseConfiguration({enable: true});
// const coinPurseDisable = Boardroid.coinPurseConfiguration({enable: false});
// const coinPurseDispense = Boardroid.coinPurseDispense({$5: 2, $10: 1});
// const coinPurseReadTubes = Boardroid.coinPurseReadTubes();
// const banknotePurseICTEnable = Boardroid.banknotePurseICTConfigure({enable: true});
// const banknotePurseICTDisable = Boardroid.banknotePurseICTConfigure({enable: false});
// const banknotePurseOtherEnable = Boardroid.banknotePurseOtherConfigure({enable: true});
// const banknotePurseOtherDisable = Boardroid.banknotePurseOtherConfigure({enable: false});
// const banknotePurseIctDispense = Boardroid.banknotePurseICTDispense({quantity: 1, denomination: 50});
// const banknotePurseOtherDispense = Boardroid.banknotePurseOtherDispense({$20: 3, $50: 1, $100: 1});
// const banknotePurseAcceptInScrow = Boardroid.banknotePurseAcceptInScrow();
// const banknotePurseRejectInScrow = Boardroid.banknotePurseRejectInScrow();
// const banknotePurseSaveMemory = Boardroid.banknotePurseSaveMemory({ channel: 1, $20: 1, $50: 2, $100: 3, $200: 4, $500: 5, $1000: 6});
// const banknotePurseReadRecycler = Boardroid.banknotePurseReadRecycler();
// const cardReaderDisable = Boardroid.cardReaderDisable();
// const cardReaderDispense = Boardroid.cardReaderDispense({selection: 1,price: 10});
// const coolingRelayEnable = Boardroid.coolingRelayConfigure({ enable: true });
// const coolingRelayDisable = Boardroid.coolingRelayConfigure({ enable: false });
// const readTemperature = Boardroid.readTemperature();
// const dispense = Boardroid.dispense({ selection: 1});
// const customCode = Boardroid.customCode([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x00]);
// const customCodeString = Boardroid.customCode(['01', '02', '03', '04', '05', '06', '07', '08', '09', '0a', '0b', '00']);
// // ----------------------------------------------------
// printAsFormat(connection);
// printAsFormat(coinPurseEnable);
// printAsFormat(coinPurseDisable);
// printAsFormat(coinPurseDispense);
// printAsFormat(coinPurseReadTubes);
// printAsFormat(banknotePurseICTEnable);
// printAsFormat(banknotePurseICTDisable);
// printAsFormat(banknotePurseOtherEnable);
// printAsFormat(banknotePurseOtherDisable);
// printAsFormat(banknotePurseIctDispense);
// printAsFormat(banknotePurseOtherDispense);
// printAsFormat(banknotePurseAcceptInScrow);
// printAsFormat(banknotePurseRejectInScrow);
// printAsFormat(banknotePurseSaveMemory);
// printAsFormat(banknotePurseReadRecycler);
// printAsFormat(cardReaderDisable);
// printAsFormat(cardReaderDispense);
// printAsFormat(coolingRelayEnable);
// printAsFormat(coolingRelayDisable);
// printAsFormat(readTemperature);
// printAsFormat(dispense);
// printAsFormat(customCode);
// printAsFormat(customCodeString);

// // Locker
// const printAsFormat = (data: Uint8Array | Array<string>) => {
//     if (data instanceof Uint8Array) {
//         console.log(data, Uint8ArrayToHex({ data, asString: false }));
//     } else if (Array.isArray(data)) {
//         console.log(data, hexToUint8Array(data));
//     }
// }
// Locker.asHex = false;
// const connection = Locker.connection();
// const openCell = Locker.openCell({ cell: 1, channel: 1 });
// const lightScan = Locker.lightScan({ since: 0, until: 10, channel: 1 });
// const enableCell = Locker.enableCell({ cell: 1, channel: 1 });
// const disableCell = Locker.disableCell({ cell: 1, channel: 1 });
// // ----------------------------------------------------
// printAsFormat(connection);
// printAsFormat(openCell);
// printAsFormat(lightScan);
// printAsFormat(enableCell);
// printAsFormat(disableCell);

// // Relay
// const activate = Relay.activate();
// const deactivate = Relay.deactivate();
// // ----------------------------------------------------
// console.log(activate, Uint8ArrayToHex({ data: activate, asString: false }));
// console.log(deactivate, Uint8ArrayToHex({ data: deactivate, asString: false }));

// // Arduino
// const connect = Arduino.connect();
// const ara = Arduino.ara();
// const credits = Arduino.credits();
// const hi = Arduino.hi();
// const custom = Arduino.custom("danidoble was here");
// // ----------------------------------------------------
// console.log(connect, Uint8ArrayToString({ data: connect, removeAppend: true }));
// console.log(ara, Uint8ArrayToString({ data: ara, removeAppend: true }));
// console.log(credits, Uint8ArrayToString({ data: credits, removeAppend: true }));
// console.log(hi, Uint8ArrayToString({ data: hi, removeAppend: true }));
// console.log(custom, Uint8ArrayToString({ data: custom, removeAppend: true }));

// // PinPax
// const printAsFormat = (data: Uint8Array) => {
//     console.log(data, JSON.parse(Uint8ArrayToString({ data, removeAppend: true, appended: "\r\n" })));
// }
// const connection = PinPax.connection();
// const custom = PinPax.custom(JSON.stringify({ action: "CUSTOM", data: "danidoble was here" }));
// const readQRQA = PinPax.readQR({ type: "qa" });
// const readQRProd = PinPax.readQR({ type: "production" });
// const forceHide = PinPax.forceHide();
// const forceShow = PinPax.forceShow();
// const makeSale = PinPax.makeSale({ amount: 10, reference: "danidoble" });
// const getVoucher = PinPax.getVoucher({ folio: 123 });
// const info = PinPax.info();
// const keepAlive = PinPax.keepAlive();
// const restartApp = PinPax.restartApp();
// const getConfig = PinPax.getConfig();
// const hideButtons = PinPax.hideButtons();
// const showButtons = PinPax.showButtons();
// const demo = PinPax.demo();
// const refund = PinPax.refund({amount: 10, folio: 123, auth: 456});
// const exitFun = PinPax.exit();
// const init = PinPax.init();
// // ----------------------------------------------------
// printAsFormat(connection);
// printAsFormat(custom);
// printAsFormat(readQRQA);
// printAsFormat(readQRProd);
// printAsFormat(forceHide);
// printAsFormat(forceShow);
// printAsFormat(makeSale);
// printAsFormat(getVoucher);
// printAsFormat(info);
// printAsFormat(keepAlive);
// printAsFormat(restartApp);
// printAsFormat(getConfig);
// printAsFormat(hideButtons);
// printAsFormat(showButtons);
// printAsFormat(demo);
// printAsFormat(refund);
// printAsFormat(exitFun);
// printAsFormat(init);

export {
  parseToBuffer,
  Uint8ArrayToString,
  Uint8ArrayToHex,
  hexToUint8Array,
  Arduino,
  Relay,
  Locker,
  Boardroid,
  PinPax,
  Jofemar,
};
