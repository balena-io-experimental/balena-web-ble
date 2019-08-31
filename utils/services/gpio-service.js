const util = require("util");

const bleno = require("bleno");

const BlenoPrimaryService = bleno.PrimaryService;

const LEDCharacteristic = require("../characteristics/led-characteristic");

function GPIOService() {
  GPIOService.super_.call(this, {
    uuid: "fff0",
    characteristics: [new LEDCharacteristic()]
  });
}

util.inherits(GPIOService, BlenoPrimaryService);

module.exports = GPIOService;
