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

## CHANGELOG

### v1.1
- Remove all the logic surrounding tracking open tunnels, killing existing
tunnels, and tunnel timeouts. (#3)


