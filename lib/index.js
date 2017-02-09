import checkDoorStatus from 'trackpin-scrape';

let Service, Characteristic;

export default function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-trackpin", "TRACKPIN", TrackPin);
}

const TrackPin = (log, config) => {
  this.log = log;

  // credentials info
  this.credentials = {
    email: config['email'],
    password: config['password']
  };

  this.name = config["name"];
  this.manufacturer = config["manufacturer"] || "@wurmr";
  this.model = config["model"] || "Model not available";
  this.serial = config["serial"] || "Non-defined serial";
};

TrackPin.prototype = {
  identify: function (callback) {
    this.log("Identify requested!");
    callback(); // success
  },

  getDoorPosition: function (callback) {
    callback(checkDoorStatus(this.credentials));
  },

  getServices: function () {
    const informationService = new Service.AccessoryInformation();

    informationService
      .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
      .setCharacteristic(Characteristic.Model, this.model)
      .setCharacteristic(Characteristic.SerialNumber, this.serial);

    const doorService = new Service.Door();
    doorService
      .getCharacteristic(Characteristic.CurrentPosition)
      .on('get', this.getDoorPosition.bind(this));

    return [informationService, doorService];
    //         this.addCharacteristic(Characteristic.CurrentPosition);
    //   this.addCharacteristic(Characteristic.PositionState);
    //   this.addCharacteristic(Characteristic.TargetPosition);
  }
};
