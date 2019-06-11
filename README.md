[![Build Status](https://travis-ci.com/cpuabuse/node-system.svg?branch=master)](https://travis-ci.com/cpuabuse/node-system)
[![npm version](https://badge.fury.io/js/cpuabuse-system.svg)](https://badge.fury.io/js/cpuabuse-system)
[![Coverage Status](https://coveralls.io/repos/github/cpuabuse/node-system/badge.svg?branch=master)](https://coveralls.io/github/cpuabuse/node-system?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/381bca0c5f71d32f23df/maintainability)](https://codeclimate.com/github/cpuabuse/node-system/maintainability)
[![Inline docs](http://inch-ci.org/github/cpuabuse/node-system.svg?branch=master)](http://inch-ci.org/github/cpuabuse/node-system)

# About

## Project

![Framework Infrastructure](https://s3.ap-northeast-2.amazonaws.com/file.cpuabuse.com/public/boop/imageset/programming/site/2018-10-26/4927c8224eda0669accd97bc91766ad2.png)

- [cpuabuse-framework](https://github.com/cpuabuse/node-framework)
- [cpuabuse-app](https://github.com/cpuabuse/node-app)
- [cpuabuse-server](https://github.com/cpuabuse/node-server)
- [cpuabuse-system](https://github.com/cpuabuse/node-system)

## Tests Member Declaration

Type | Selector
---|---
static | `.`
inner | `~`
instance | `#`

## Files & Data

- Folders are treated as children of system root, while the files are treated as grandchildren.
- Default file extension is added, if missing.
- For empty value in key/value pair, value equal to key is assumed.
- In absent key/value child pairs, default values for missing keys are assumed.

## Structure

![Structure](https://s3.ap-northeast-2.amazonaws.com/file.cpuabuse.com/public/boop/imageset/programming/site/2018-10-26/4d3f5711c3c47d3eb60a7c08281aa2a2.png)