sauce-tunnel
============

A Node.js wrapper around the Saucelabs tunnel jar.

This code is extracted from
[grunt-saucelabs](https://github.com/axemclion/grunt-saucelabs) by
[axemclion](https://github.com/axemclion), with the grunt-specific parts
removed.

It was extracted into its own module to avoid duplication between
grunt-saucelabs,
[grunt-mocha-webdriver](https://github.com/grunt-mocha-webdriver), and any
future Node module that may need it.

## Usage
Before starting the tunnel, initialize it first

```
var tunnel = new SauceTunnel(SAUCE_USERNAME, SAUCE_ACCESSKEY, tunnelIdentifier, tunneled, extraFlags);
```

1. `SAUCE_USERNAME` and `SAUCE_ACCESSKEY` are the username and the accesskey for saucelabs. They are usually set as environment variables (specially in continuous integration tools like [travis](http://travis-ci.org) ) 
2. The `tunnelIdentifier` is a unique identifier for the tunnel. It is optional and is automatically generated when not specified. Note that the tunnel identifier may have to be passed in with the browsers object as a desired capability to enable traffic to use the tunnel. More details [here](https://saucelabs.com/docs/additional-config#tunnel-identifier)
3. The `tunneled` attribute is a boolean value to indicate if the tunnel is to be created or not. This value can be set to `false` to mock a tunnel creation if the site tested is publically accessible. To create a tunnel, set this value to `true`.
4. The ``extraFlags`` attribute is an optioonal array of options flags (see [here](https://saucelabs.com/docs/connect)). Example: ``['--debug', '--direct-domains', 'www.google.com']``

One the tunnel is initialized, start the tunnel using it with the following command. 

```
tunnel.start(function(status){
  // status === true indicates that the tunnel was successfully created. 
});
```

The actual webdriver code to run the test cases can be added inside the callback function. Once the webdriver completes its task, you can shut down the tunnel using

```
tunnel.stop(function(){
  // Tunnel was stopped
});
```

## Full Example
To get started easily, here is the code you can copy paste

```
var SauceTunnel = require('sauce-tunnel');
var tunnel = new SauceTunnel(process.env.SAUCE_USERNAME, process.env.SAUCE_ACCESSKEY, 'tunnel', true/* ['--debug'] */);
tunnel.start(function(status){
  if (status === false){
    throw new Error('Something went wrong with the tunnel');
  }
  /** var wd =  ... Work with the web driver**/
  // Once all webdriver work is done
  tunnel.stop(function(){
    // Tunnel destroyed
  });
});
```

## CHANGELOG

### v1.1
- Remove all the logic surrounding tracking open tunnels, killing existing
tunnels, and tunnel timeouts. (#3)


