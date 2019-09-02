const bleno = require("bleno");
const DeviceInfoService = require("./utils/services/device-info-service");
const GpioService = require("./utils/services/gpio-service");
const deviceInfoService = new DeviceInfoService();
const gpioService = new GpioService();

bleno.on("stateChange", state => {
  console.log(`on -> stateChange: ${state}`);

  if (state === "poweredOn") {
    bleno.startAdvertising("balenaBLE", [
      deviceInfoService.uuid,
      gpioService.uuid
    ]);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on("advertisingStart", error => {
  console.log(
    `on -> advertisingStart: ${error ? "error " + error : "success"}`
  );

  if (!error) {
    bleno.setServices([deviceInfoService, gpioService], error => {
      console.log(`setServices: ${error ? "error " + error : "success"}`);
    });
  }
});
