[![travis](https://img.shields.io/travis/com/cpuabuse/node-system.svg)](https://travis-ci.com/cpuabuse/node-system)
[![npm](https://img.shields.io/npm/v/cpuabuse-system.svg)](https://www.npmjs.com/package/cpuabuse-system)
[![coverage](https://img.shields.io/codecov/c/github/cpuabuse/node-system.svg)](https://codecov.io/gh/cpuabuse/node-system)
[![CodeFactor](https://www.codefactor.io/repository/github/cpuabuse/node-system/badge)](https://www.codefactor.io/repository/github/cpuabuse/node-system)
[![dependecies](https://img.shields.io/librariesio/release/npm/cpuabuse-system.svg)](https://libraries.io/npm/cpuabuse-system)
[![documentation](https://img.shields.io/badge/documentation-gh--pages-success.svg)](https://cpuabuse.github.io/node-system/)
[![chat](https://img.shields.io/badge/chat-slack-success.svg)](https://join.slack.com/t/cpuabuse/shared_invite/enQtNjYzMjQ4NjY1MTUzLTZjMTY1M2NiYmZkNzBjMzI0YTQ4OGVjZDA1ODJkNjFiNDU1NDQwYjViMjBjODA1Y2Y4ZjNiYmUzODA2YWI3NDM)

# About

## Related projects

- [cpuabuse-framework](https://github.com/cpuabuse/node-framework)
- [cpuabuse-app](https://github.com/cpuabuse/node-app)
- [cpuabuse-server](https://github.com/cpuabuse/node-server)
- [cpuabuse-system](https://github.com/cpuabuse/node-system)

## Description

The system handles initialization of data structures using information from yaml files. System is split into multiple extendable modular subsystems, responsible for respective functionality such as file system, error handling, internal system logic, etc.

## Installation

## API

### TypeScript

```typescript
// Import
import {Behaviors, ErrorCallback, Options, System} from "cpuabuse-system";

// Init options
let options: Options = {
  id: "my_system",
  initFilename: "init",
  logging: "off",
  relativeInitDir: "my_system",
  rootDir: "root"
};

// Init behaviors
let behaviors: Behaviors = [
  {
    system_load() {
      console.log("done");
    }
  }
]

// Create a system
let mySystem: System = new System({options, behaviors, onError});
```