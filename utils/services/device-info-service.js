const util = require("util");

const bleno = require("bleno");

const BlenoPrimaryService = bleno.PrimaryService;

const CPUManufacturerCharacteristic = require("../characteristics/cpu-manufacturer-characteristic");
const CPUSpeedCharacteristic = require("../characteristics/cpu-speed-characteristic");

function CPUInfoService() {
  CPUInfoService.super_.call(this, {
    uuid: "fff1",
    characteristics: [
      new CPUManufacturerCharacteristic(),
      new CPUSpeedCharacteristic()
    ]
  });
}

util.inherits(CPUInfoService, BlenoPrimaryService);

module.exports = CPUInfoService;
