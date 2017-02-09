import checkDoorStatus from 'trackpin-node';

let Service, Characteristic;

module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-trackpin", "TRACKPIN", TrackPin);
}

class TrackPin {
  constructor(log, config) {
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
  }

  identify(callback) {
    this.log("Identify requested!");
    callback(); // success
  }

  getDoorPosition(callback) {
    // The value property of CurrentDoorState must be one of the following:
    // Characteristic.CurrentDoorState.OPEN = 0;
    // Characteristic.CurrentDoorState.CLOSED = 1;
    // Characteristic.CurrentDoorState.OPENING = 2;
    // Characteristic.CurrentDoorState.CLOSING = 3;
    // Characteristic.CurrentDoorState.STOPPED = 4;


    checkDoorStatus(this.credentials).then(result => {
      console.log('got current door state', Characteristic.CurrentDoorState[result]);
      callback(null, Characteristic.CurrentDoorState[result]);
    });
  }

  setDoorPosition(state, callback) {
    this.log("Setting state to " + state);
    // this.targetState = state;
    // var isClosed = this.isClosed();
    // if ((state == DoorState.OPEN && isClosed) || (state == DoorState.CLOSED && !isClosed)) {
    //   this.log("Triggering GarageDoor Relay");
    //   this.operating = true;
    //   if (state == DoorState.OPEN) {
    //     this.currentDoorState.setValue(DoorState.OPENING);
    //   } else {
    //     this.currentDoorState.setValue(DoorState.CLOSING);
    //   }
    //   setTimeout(this.setFinalDoorState.bind(this), this.doorOpensInSeconds * 1000);
    //   this.switchOn();
    // }

    this.getDoorPosition((err, s) => {
      console.log('setting current door state value to', s);
      this.currentDoorState.setValue(s);
    });

    callback();
  }

  getTargetState(callback) {
    console.log('getting target state');
    getDoorPosition(callback);
  }

  doorChanged() {
    console.log('change happened');
  }

  getServices() {
    const informationService = new Service.AccessoryInformation();

    informationService
      .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
      .setCharacteristic(Characteristic.Model, this.model)
      .setCharacteristic(Characteristic.SerialNumber, this.serial);

    const doorService = new Service.GarageDoorOpener(this.name);
    doorService    
      .getCharacteristic(Characteristic.CurrentDoorState)
      .on('get', this.getDoorPosition.bind(this))
      .on('change', this.doorChanged.bind(this));

    doorService
      .setCharacteristic(Characteristic.TargetDoorState, Characteristic.TargetDoorState.CLOSED) // force initial state to CLOSED
      .getCharacteristic(Characteristic.TargetDoorState)
      .on('set', this.setDoorPosition.bind(this));

    this.currentDoorState = doorService.getCharacteristic(Characteristic.CurrentDoorState);

    return [informationService, doorService];
    // // Required Characteristics
    // this.addCharacteristic(Characteristic.CurrentDoorState);
    // this.addCharacteristic(Characteristic.TargetDoorState);
    // this.addCharacteristic(Characteristic.ObstructionDetected);
  }
}
