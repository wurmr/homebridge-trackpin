# homebridge-trackpin
## Trackpin Garage Door status plugin

[![npm version](https://badge.fury.io/js/homebridge-trackpin.svg)](https://badge.fury.io/js/homebridge-trackpin)
[![Build Status](https://travis-ci.org/wurmr/homebridge-trackpin.svg?branch=master)](https://travis-ci.org/wurmr/homebridge-trackpin)
[![dependencies Status](https://david-dm.org/wurmr/homebridge-trackpin/status.svg)](https://david-dm.org/wurmr/homebridge-trackpin)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.png?v=103)](https://opensource.org/licenses/mit-license.php)


This plugin is designed to get status from the TrackPin (http://trackpin.com/) garage door opener system.

This system does not provide the ability to trigger the garage door remotely so this plugin is only designed to get the status of the garage door.

Install the plugin:
`$ npm install homebridge-trackpin -g`

Example `config.json`:
```json
"accessories": [
    {
        "accessory": "TRACKPIN",
        "name": "Garage Door",
        "email": "email@abc.com",
        "password": "secret",
        "interval": 10000,
        "pins": ["Family", "Cleaners"]
    }
]
```

`pins` is an optional array of a list of pins you would like to expose to homekit.
`interval` is an optional parameter.  By default the plugin will poll the garage door every 5 seconds, if you want it different this setting is in milliseconds.