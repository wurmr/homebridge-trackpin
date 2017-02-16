# homebridge-trackpin
## Trackpin Garage Door status plugin

This plugin is designed to get status from the TrackPin (http://trackpin.com/) garage door opener system.

This system does not provide the ability to trigger the garage door remotely so this plugin is only designed to get the status of the garage door.

Install the plugin:
`$ npm install homebridge-trackpin -g`

Example `config.json`:
```
      "accessories": [
    {
        "accessory": "TRACKPIN",
        "name": "Garage Door",
        "email": "email@abc.com",
        "password": "secret",
        "interval": 10000
    }
  ]
```

`interval` is an optional parameter.  By default the plugin will poll the garage door every 5 seconds, if you want it different this setting is in milliseconds.

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)