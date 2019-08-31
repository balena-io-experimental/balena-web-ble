const util = require("util");
const si = require("systeminformation");

const bleno = require("bleno");

const Descriptor = bleno.Descriptor;
const Characteristic = bleno.Characteristic;

class CPUSpeedCharacteristic {
  constructor() {
    CPUSpeedCharacteristic.super_.call(this, {
      uuid: "d7e84cb2-ff37-4afc-9ed8-5577aeb84541",
      properties: ["read"],
      descriptors: [
        new Descriptor({
          uuid: "2901",
          value: "CPU Speed"
        })
      ]
    });
  }

  onReadRequest(offset, callback) {
    if (offset) {
      callback(this.RESULT_ATTR_NOT_LONG, null);
    } else {
      si.cpu()
        .then(data => {
          callback(this.RESULT_SUCCESS, Buffer.from(data.speed, "utf-8"));
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
}

util.inherits(CPUSpeedCharacteristic, Characteristic);

module.exports = CPUSpeedCharacteristic;
