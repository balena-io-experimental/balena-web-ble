const util = require("util");
const bleno = require("bleno");
const Gpio = require("onoff").Gpio;
const led_pin = process.env.LED_PIN || 17;
const led = new Gpio(led_pin, "out");

const btn_pin = process.env.BTN_PIN || 4;
const button = new Gpio(btn_pin, "in", "rising", { debounceTimeout: 10 });
const Descriptor = bleno.Descriptor;
const Characteristic = bleno.Characteristic;

class LEDCharacteristic {
  constructor() {
    LEDCharacteristic.super_.call(this, {
      uuid: "d7e84cb2-ff37-4afc-9ed8-5577aeb8454c",
      properties: ["read", "write", "notify"],
      descriptors: [
        new Descriptor({
          uuid: "2901",
          value: "Turn LED on/off"
        })
      ]
    });

    button.watch((err, value) => {
      if (err) {
        throw err;
      }
      let toggledState = led.readSync() ^ 1;

      led.writeSync(toggledState);

      if (this.updateValueCallback) {
        console.log(`Sending notification with value ${toggledState}`);

        const buf = Buffer.alloc(1);
        buf.writeUInt8(toggledState);

        this.updateValueCallback(buf);
      }
    });
  }

  onSubscribe(maxValueSize, updateValueCallback) {
    console.log(`Subscribed, max value size is ${maxValueSize}`);
    this.updateValueCallback = updateValueCallback;
  }

  onUnsubscribe() {
    console.log("Unsubscribed");
    this.updateValueCallback = null;
  }

  onReadRequest(offset, callback) {
    if (offset) {
      callback(this.RESULT_ATTR_NOT_LONG, null);
    } else {
      const buf = Buffer.alloc(1);
      buf.writeUInt8(led.readSync());
      callback(this.RESULT_SUCCESS, buf);
    }
  }

  onWriteRequest(data, offset, withoutResponse, callback) {
    let payload = data.readUInt8();
    if (payload == 0 || payload == 1) {
      console.log(`switching LED: ${payload ? "on" : "off"}`);
      led.writeSync(payload);
      callback(this.RESULT_SUCCESS);
    }
  }
}

util.inherits(LEDCharacteristic, Characteristic);

module.exports = LEDCharacteristic;
