const util = require("util");
const bleno = require("bleno");
const Gpio = require("onoff").Gpio;
const led = new Gpio(17, "out");
const Descriptor = bleno.Descriptor;
const Characteristic = bleno.Characteristic;

class LEDCharacteristic {
  constructor() {
    LEDCharacteristic.super_.call(this, {
      uuid: "d7e84cb2-ff37-4afc-9ed8-5577aeb8454c",
      properties: ["read", "write"],
      descriptors: [
        new Descriptor({
          uuid: "2901",
          value: "Turn LED(GPIO17) on/off"
        })
      ]
    });
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

process.on("SIGINT", () => {
  led.unexport();
});

util.inherits(LEDCharacteristic, Characteristic);

module.exports = LEDCharacteristic;
