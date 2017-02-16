import { checkDoorStatus, listPins } from 'trackpin-node'

let Service, Characteristic

export default function (homebridge) {
  Service = homebridge.hap.Service
  Characteristic = homebridge.hap.Characteristic
  homebridge.registerAccessory('homebridge-trackpin', 'TRACKPIN', TrackPin)
}

class TrackPin {
  constructor (log, config) {
    this.log = log

    // credentials info
    this.credentials = {
      email: config['email'],
      password: config['password']
    }

    this.interval = config['interval'] || 5000
    this.name = config['name']
    this.manufacturer = config['manufacturer'] || '@wurmr'
    this.model = config['model'] || 'Model not available'
    this.serial = config['serial'] || 'Non-defined serial'
  }

  identify (callback) {
    callback() // success
  }

  async getDoorPosition (callback) {
    const result = await checkDoorStatus(this.credentials)

    if (result.status === 'OPEN' && this.pinSensorMap.get(result.lastPin)) {
      this.pinSensorMap.get(result.lastPin).setValue(Characteristic.ContactSensorState.CONTACT_DETECTED)
    } else {
      this.pinSensorMap.forEach(sensor => {
        sensor.setValue(Characteristic.ContactSensorState.CONTACT_NOT_DETECTED)
      })
    }

    callback(null, this.convertResult(result.status))
  }

  convertResult (result) {
    return result === 'OPEN'
      ? Characteristic.ContactSensorState.CONTACT_NOT_DETECTED
      : Characteristic.ContactSensorState.CONTACT_DETECTED
  }

  async getServices () {
    const informationService = new Service.AccessoryInformation()
    const pins = await listPins(this.credentials)

    informationService
      .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
      .setCharacteristic(Characteristic.Model, this.model)
      .setCharacteristic(Characteristic.SerialNumber, this.serial)

    const doorSensor = new Service.ContactSensor(this.name, 'Garage Door')
    doorSensor
      .getCharacteristic(Characteristic.ContactSensorState)
      .on('get', this.getDoorPosition.bind(this))

    this.currentSensorState = doorSensor.getCharacteristic(Characteristic.ContactSensorState)

    const pinSensors = pins.map(pin => {
      return new Service.ContactSensor(`${pin} Garage Pin`, 'Garage Pin')
    })

    this.pinSensorMap = new Map()
    pinSensors.forEach(sensor => {
      this.pinSensorMap.set(sensor.name, sensor.getCharacteristic(Characteristic.ContactSensorState))
    })

    setInterval(() => {
      checkDoorStatus(this.credentials).then(result => {
        this.currentSensorState.setValue(this.convertResult(result))
      })
    }, this.interval)

    return [informationService, doorSensor, ...pinSensors]
  }
}
