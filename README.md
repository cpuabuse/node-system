[![Travis (.com)](https://img.shields.io/travis/com/cpuabuse/node-system.svg?style=for-the-badge)](https://travis-ci.com/cpuabuse/node-system)
[![npm](https://img.shields.io/npm/v/cpuabuse-system.svg?style=for-the-badge)](https://www.npmjs.com/package/cpuabuse-system)
[![Codecov](https://img.shields.io/codecov/c/github/cpuabuse/node-system.svg?style=for-the-badge)](https://codecov.io/gh/cpuabuse/node-system)
[![Codacy grade](https://img.shields.io/codefactor/grade/github/cpuabuse/node-system.svg?style=for-the-badge)](https://www.codefactor.io/repository/github/cpuabuse/node-system)
[![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/cpuabuse-system.svg?style=for-the-badge)](https://libraries.io/npm/cpuabuse-system)
[![Documentation](https://img.shields.io/badge/documentation-gh--pages-success.svg?style=for-the-badge)](https://cpuabuse.github.io/node-system/)
[![Chat](https://img.shields.io/badge/chat-slack-success.svg?style=for-the-badge)](https://join.slack.com/t/cpuabuse/shared_invite/enQtNjYzMjQ4NjY1MTUzLTZjMTY1M2NiYmZkNzBjMzI0YTQ4OGVjZDA1ODJkNjFiNDU1NDQwYjViMjBjODA1Y2Y4ZjNiYmUzODA2YWI3NDM)

# About

## Related projects

- [cpuabuse-framework](https://github.com/cpuabuse/node-framework)
- [cpuabuse-app](https://github.com/cpuabuse/node-app)
- [cpuabuse-server](https://github.com/cpuabuse/node-server)
- [cpuabuse-system](https://github.com/cpuabuse/node-system)

## Description

The system handles initialization of data structures using information from yaml files. System is split into multiple extendable modular subsystems, responsible for respective functionality such as file system, error handling, internal system logic, etc.

## Setup

### Requirements

- Node.js version 10 and higher

### Dependencies

- [js-yaml](https://github.com/nodeca/js-yaml)

### Installation

```
npm install cpuabuse-system --save
```

## API

### TypeScript

```typescript
// Import
import { Behaviors, ErrorCallback, Options, System } from "cpuabuse-system";

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
];

// Create a system
let mySystem: System = new System({ options, behaviors, onError });
```

### Node.js

```javascript
// Import
const system = require("cpuabuse-system");

// Init options
let options = {
	id: "my_system",
	initFilename: "init",
	logging: "off",
	relativeInitDir: "my_system",
	rootDir: "root"
};

// Init behaviors
let behaviors = [
	{
		system_load() {
			console.log("done");
		}
	}
];

// Create a system
let mySystem = new system.System({ options, behaviors, onError });
```
