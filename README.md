[![Build Status](https://travis-ci.com/cpuabuse/node-system.svg?branch=master)](https://travis-ci.com/cpuabuse/node-system)
[![npm version](https://badge.fury.io/js/cpuabuse-system.svg)](https://badge.fury.io/js/cpuabuse-system)
[![Coverage Status](https://coveralls.io/repos/github/cpuabuse/node-system/badge.svg?branch=master)](https://coveralls.io/github/cpuabuse/node-system?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/381bca0c5f71d32f23df/maintainability)](https://codeclimate.com/github/cpuabuse/node-system/maintainability)
[![Inline docs](http://inch-ci.org/github/cpuabuse/node-system.svg?branch=master)](http://inch-ci.org/github/cpuabuse/node-system)

**Files & Data**

- Default file extension is added, if missing
- For empty value in key/value pair, value equal to key is assumed
- In absent key/value child pairs, default values for missing keys are assumed

**JSDoc - Member Declaration**

Type | Selector | Declaration
---|---|---
static | `.` | Default
inner | `~` | `@inner`<br>`@memberof module:myModule~myMember`
instance | `#` | `@instance`

<a name="module_system"></a>

## system

System is intended more than anything, for centralized managment.


* [system](#module_system)
    * _static_
        * [.System](#module_system.System) ⇐ [<code>Loader</code>](#module_system..Loader)
            * [new System(id, rootDir, relativeInitDir, initFilename, [behaviors])](#new_module_system.System_new)
            * _instance_
                * *[.events](#module_system.System+events) : <code>Object</code>*
                    * *["system_load"](#module_system.System+events+event_system_load)*
                * [.system](#module_system.System+system) : [<code>options</code>](#module_system..System..options)
                * [.addError(code, message)](#module_system.System+addError)
                * [.addBehaviors(behaviors)](#module_system.System+addBehaviors)
                * [.log(text)](#module_system.System+log)
                * [.fire(name, [message])](#module_system.System+fire)
                * [.processNewSystemError(code, message)](#module_system.System+processNewSystemError)
                * [.processError(error)](#module_system.System+processError)
                * [.behave(event)](#module_system.System+behave)
            * _static_
                * [.checkOptionsFailure(options)](#module_system.System.checkOptionsFailure) ⇒ <code>boolean</code>
                * [.error(text)](#module_system.System.error)
                * [.log(text)](#module_system.System.log)
            * _inner_
                * ["behavior_attach"](#module_system.System..event_behavior_attach)
                * ["behavior_attach_fail"](#module_system.System..event_behavior_attach_fail)
                * ["behavior_attach_request_fail"](#module_system.System..event_behavior_attach_request_fail)
                * ["type_error"](#module_system.System..event_type_error)
                * ["event_fail"](#module_system.System..event_event_fail)
        * [.AtomicLock](#module_system.AtomicLock)
            * [new AtomicLock()](#new_module_system.AtomicLock_new)
            * [.locked](#module_system.AtomicLock+locked) : <code>boolean</code> ℗
            * [.lock()](#module_system.AtomicLock+lock) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
            * [.release()](#module_system.AtomicLock+release)
    * _inner_
        * [~Loader](#module_system..Loader)
            * [new Loader(rootDir, relativeInitDir, initFilename, callback)](#new_module_system..Loader_new)
            * _static_
                * [.getFile(rootDir, relativeDir, file)](#module_system..Loader.getFile) ⇒ <code>external.Promise</code>
                * [.toRelative(rootDir, target)](#module_system..Loader.toRelative) ⇒ <code>external.Promise</code>
                * [.join(rootDir, target)](#module_system..Loader.join) ⇒ <code>external.Promise</code>
                * [.isFile(rootDir, relativeDir, filename)](#module_system..Loader.isFile) ⇒ <code>boolean</code>
                * [.isDir(rootDir, relativeDir)](#module_system..Loader.isDir) ⇒ <code>boolean</code>
                * [.list(rootDir, relativeDir)](#module_system..Loader.list) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
                * [.yamlToObject(string)](#module_system..Loader.yamlToObject) ⇒ <code>Object</code>
            * _inner_
                * [~initRecursion(rootDir, relativePath, initFilename, targetObject, extend)](#module_system..Loader..initRecursion) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
                * [~initSettings(rootDir, initPath, filename)](#module_system..Loader..initSettings) ⇒ <code>Object</code>
                * [~loadYaml(rootDir, relativeDir, filename)](#module_system..Loader..loadYaml) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
        * [~SystemError](#module_system..SystemError) ⇐ <code>external:error</code>
            * [new SystemError(code, message)](#new_module_system..SystemError_new)
            * _instance_
                * [.code](#module_system..SystemError+code) : <code>string</code> ℗
            * _static_
                * [.isSystemError(error)](#module_system..SystemError.isSystemError) ⇒ <code>boolean</code>
        * [~Behavior](#module_system..Behavior) ⇐ [<code>EventEmitter</code>](https://nodejs.org/api/events.html#events_class_eventemitter)
            * [new Behavior()](#new_module_system..Behavior_new)
            * [.atomicLock](#module_system..Behavior+atomicLock) : [<code>AtomicLock</code>](#module_system.AtomicLock) ℗
            * [.behaviorId](#module_system..Behavior+behaviorId) : <code>Object</code> ℗
            * [.behaviorIndex](#module_system..Behavior+behaviorIndex) : <code>Array.&lt;string&gt;</code> ℗
            * [.nextBehaviorCounter](#module_system..Behavior+nextBehaviorCounter) : <code>number</code> ℗
            * [.addBehavior(name, callback)](#module_system..Behavior+addBehavior) ⇒ <code>number</code>
            * [.behave(name)](#module_system..Behavior+behave)

<a name="module_system.System"></a>

## system.System ⇐ [<code>Loader</code>](#module_system..Loader)

Provides wide range of functionality for file loading and event exchange.

**Kind**: static class of [<code>system</code>](#module_system)  
**Extends**: [<code>Loader</code>](#module_system..Loader)  
**Emits**: [<code>system\_load</code>](#module_system.System+events+event_system_load)  

* [.System](#module_system.System) ⇐ [<code>Loader</code>](#module_system..Loader)
    * [new System(id, rootDir, relativeInitDir, initFilename, [behaviors])](#new_module_system.System_new)
    * _instance_
        * *[.events](#module_system.System+events) : <code>Object</code>*
            * *["system_load"](#module_system.System+events+event_system_load)*
        * [.system](#module_system.System+system) : [<code>options</code>](#module_system..System..options)
        * [.addError(code, message)](#module_system.System+addError)
        * [.addBehaviors(behaviors)](#module_system.System+addBehaviors)
        * [.log(text)](#module_system.System+log)
        * [.fire(name, [message])](#module_system.System+fire)
        * [.processNewSystemError(code, message)](#module_system.System+processNewSystemError)
        * [.processError(error)](#module_system.System+processError)
        * [.behave(event)](#module_system.System+behave)
    * _static_
        * [.checkOptionsFailure(options)](#module_system.System.checkOptionsFailure) ⇒ <code>boolean</code>
        * [.error(text)](#module_system.System.error)
        * [.log(text)](#module_system.System.log)
    * _inner_
        * ["behavior_attach"](#module_system.System..event_behavior_attach)
        * ["behavior_attach_fail"](#module_system.System..event_behavior_attach_fail)
        * ["behavior_attach_request_fail"](#module_system.System..event_behavior_attach_request_fail)
        * ["type_error"](#module_system.System..event_type_error)
        * ["event_fail"](#module_system.System..event_event_fail)

<a name="new_module_system.System_new"></a>

## new System(id, rootDir, relativeInitDir, initFilename, [behaviors])

**Throws**:

- [<code>Error</code>](https://nodejs.org/api/errors.html#errors_class_error) Throws standard error if failed to perform basic initializations, or system failure that cannot be reported otherwise has occured.

- `loader_failed` - Loader did not construct the property

**Note**: typeof SystemError will return false


| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | System instace internal ID |
| rootDir | <code>string</code> | The root directory for the System instance |
| relativeInitDir | <code>string</code> | The relative directory to root of the location of the initialization file |
| initFilename | <code>string</code> | Initialization file filename |
| [behaviors] | <code>module:system.System~behavior</code> | [Optional] Behaviors to add |

**Example** *(Behaviors outline)*  
```js
amazing_behavior: (that) => {
  // Process system instance on "amazing_behavior"
  amazingProcessor(that);
}
```
<a name="module_system.System+events"></a>

## *system.events : <code>Object</code>*

Events to be populated by the loader.
System by itself does not do anything about the events themselves, it only confirms that the events were initialized. Ofcourse, if the events are fired, and failure to fire event is set to throw, or undocumented events encountered, it would make troubles(System and standard throws).

**Kind**: instance abstract property of [<code>System</code>](#module_system.System)  
<a name="module_system.System+events+event_system_load"></a>

## *"system_load"*

System load event

**Kind**: event emitted by [<code>events</code>](#module_system.System+events)  
<a name="module_system.System+system"></a>

## system.system : [<code>options</code>](#module_system..System..options)

Contains system info.

**Kind**: instance property of [<code>System</code>](#module_system.System)  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| behavior | [<code>Behavior</code>](#module_system..Behavior) | Event emitter for the behaviors. Generally should use the public system instance methods instead. |
| error | <code>object</code> | Contains throwables |
| error | <code>module:system~System~file</code> | Contains throwables |

<a name="module_system.System+addError"></a>

## system.addError(code, message)

Adds an error to the System dynamically

**Kind**: instance method of [<code>System</code>](#module_system.System)  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>String</code> | Error code |
| message | <code>String</code> | Error description |

<a name="module_system.System+addBehaviors"></a>

## system.addBehaviors(behaviors)

Adds behaviors to the system, and fires post-addtion events.
Firstly, this function attempts to add the behaviors.
When the behavior addition has been processed, the function will attempt to fire post-addition events, depending on success/failure of behavior additions.
Logically the two stage separation should be done with promises, but due to huge overhead of promises and low total processing required, it will be simplified to syncronous.

**Kind**: instance method of [<code>System</code>](#module_system.System)  
**Emits**: [<code>behavior\_attach</code>](#module_system.System..event_behavior_attach), [<code>behavior\_attach\_fail</code>](#module_system.System..event_behavior_attach_fail), [<code>behavior\_attach\_request\_fail</code>](#module_system.System..event_behavior_attach_request_fail)  

| Param | Type |
| --- | --- |
| behaviors | <code>Array.&lt;module:system.System~behavior&gt;</code> | 

<a name="module_system.System+log"></a>

## system.log(text)

Log message from the System context

**Kind**: instance method of [<code>System</code>](#module_system.System)  
**Emits**: [<code>type\_error</code>](#module_system.System..event_type_error)  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>String</code> | Message |

<a name="module_system.System+fire"></a>

## system.fire(name, [message])

Fires a system event

**Kind**: instance method of [<code>System</code>](#module_system.System)  
**Throws**:

- [<code>Error</code>](https://nodejs.org/api/errors.html#errors_class_error) Will throw `error_hell`. The inability to process error - if [module:system.System~event_fail](module:system.System~event_fail) event fails.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Event name, as specified in [events](#module_system.System+events). |
| [message] | <code>String</code> | [Optional] Message is not strictly required, but preferred. If not specified, will assume value of the name |

<a name="module_system.System+processNewSystemError"></a>

## system.processNewSystemError(code, message)

Create and process an error

**Kind**: instance method of [<code>System</code>](#module_system.System)  

| Param | Type |
| --- | --- |
| code | <code>String</code> | 
| message | <code>String</code> | 

<a name="module_system.System+processError"></a>

## system.processError(error)

Process a system error - log, behavior or further throw

**Kind**: instance method of [<code>System</code>](#module_system.System)  

| Param | Type | Description |
| --- | --- | --- |
| error | [<code>SystemError</code>](#module_system..SystemError) \| <code>String</code> | SystemError error or error text |

<a name="module_system.System+behave"></a>

## system.behave(event)

Emit an event as a behavior.

**Kind**: instance method of [<code>System</code>](#module_system.System)  

| Param | Type |
| --- | --- |
| event | <code>event</code> | 

<a name="module_system.System.checkOptionsFailure"></a>

## System.checkOptionsFailure(options) ⇒ <code>boolean</code>

Checks options argument for missing incorrect property types

**Kind**: static method of [<code>System</code>](#module_system.System)  
**Returns**: <code>boolean</code> - Returns true if the arguments is corrupt; false if OK  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>options</code>](#module_system..System..options) | System options argument |

<a name="module_system.System.error"></a>

## System.error(text)

Access stderr

**Kind**: static method of [<code>System</code>](#module_system.System)  

| Param | Type |
| --- | --- |
| text | <code>String</code> | 

<a name="module_system.System.log"></a>

## System.log(text)

Access stdout

**Kind**: static method of [<code>System</code>](#module_system.System)  

| Param | Type |
| --- | --- |
| text | <code>String</code> | 

<a name="module_system.System..event_behavior_attach"></a>

## "behavior_attach"

**Kind**: event emitted by [<code>System</code>](#module_system.System)  
<a name="module_system.System..event_behavior_attach_fail"></a>

## "behavior_attach_fail"

**Kind**: event emitted by [<code>System</code>](#module_system.System)  
<a name="module_system.System..event_behavior_attach_request_fail"></a>

## "behavior_attach_request_fail"

**Kind**: event emitted by [<code>System</code>](#module_system.System)  
<a name="module_system.System..event_type_error"></a>

## "type_error"

**Kind**: event emitted by [<code>System</code>](#module_system.System)  
<a name="module_system.System..event_event_fail"></a>

## "event_fail"

**Kind**: event emitted by [<code>System</code>](#module_system.System)  
<a name="module_system.AtomicLock"></a>

## system.AtomicLock

Creates an instance of AtomicLock.
It is not intended to be actually used for parallel processing, and mutual exlusion. It is intended for abstraction of atomic logic more than anything.

**Kind**: static class of [<code>system</code>](#module_system)  

* [.AtomicLock](#module_system.AtomicLock)
    * [new AtomicLock()](#new_module_system.AtomicLock_new)
    * [.locked](#module_system.AtomicLock+locked) : <code>boolean</code> ℗
    * [.lock()](#module_system.AtomicLock+lock) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
    * [.release()](#module_system.AtomicLock+release)

<a name="new_module_system.AtomicLock_new"></a>

## new AtomicLock()

Creates an instance of AtomicLock.
Does not take any arguments or return any values.

<a name="module_system.AtomicLock+locked"></a>

## atomicLock.locked : <code>boolean</code> ℗

Indicates the locked/unlocked state.

**Kind**: instance property of [<code>AtomicLock</code>](#module_system.AtomicLock)  
**Access**: private  
<a name="module_system.AtomicLock+lock"></a>

## atomicLock.lock() ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Lock an atomic lock.

**Kind**: instance method of [<code>AtomicLock</code>](#module_system.AtomicLock)  
**Returns**: [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) - Resolves when lock succeeds  
**Example** *(Usage)*  
```js
// Lock
exampleAtomicLock.lock();
```
<a name="module_system.AtomicLock+release"></a>

## atomicLock.release()

Release atomic lock

**Kind**: instance method of [<code>AtomicLock</code>](#module_system.AtomicLock)  
**Example** *(Usage)*  
```js
// Release
exampleAtomicLock.release();
```
<a name="module_system..Loader"></a>

## system~Loader

Required by system to perform file initialization.

**Kind**: inner class of [<code>system</code>](#module_system)  

* [~Loader](#module_system..Loader)
    * [new Loader(rootDir, relativeInitDir, initFilename, callback)](#new_module_system..Loader_new)
    * _static_
        * [.getFile(rootDir, relativeDir, file)](#module_system..Loader.getFile) ⇒ <code>external.Promise</code>
        * [.toRelative(rootDir, target)](#module_system..Loader.toRelative) ⇒ <code>external.Promise</code>
        * [.join(rootDir, target)](#module_system..Loader.join) ⇒ <code>external.Promise</code>
        * [.isFile(rootDir, relativeDir, filename)](#module_system..Loader.isFile) ⇒ <code>boolean</code>
        * [.isDir(rootDir, relativeDir)](#module_system..Loader.isDir) ⇒ <code>boolean</code>
        * [.list(rootDir, relativeDir)](#module_system..Loader.list) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
        * [.yamlToObject(string)](#module_system..Loader.yamlToObject) ⇒ <code>Object</code>
    * _inner_
        * [~initRecursion(rootDir, relativePath, initFilename, targetObject, extend)](#module_system..Loader..initRecursion) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
        * [~initSettings(rootDir, initPath, filename)](#module_system..Loader..initSettings) ⇒ <code>Object</code>
        * [~loadYaml(rootDir, relativeDir, filename)](#module_system..Loader..loadYaml) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

<a name="new_module_system..Loader_new"></a>

## new Loader(rootDir, relativeInitDir, initFilename, callback)


| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>string</code> | Absolute root directory. |
| relativeInitDir | <code>string</code> | Relative path to root. |
| initFilename | <code>string</code> | Filename. |
| callback | <code>function</code> | Callback to call with Promise of completion. |

<a name="module_system..Loader.getFile"></a>

## Loader.getFile(rootDir, relativeDir, file) ⇒ <code>external.Promise</code>

Gets file contents.

**Kind**: static method of [<code>Loader</code>](#module_system..Loader)  
**Returns**: <code>external.Promise</code> - File contents.  

| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>string</code> | Root directory. |
| relativeDir | <code>string</code> | Directory relative to root. |
| file | <code>string</code> | Full file name. |

<a name="module_system..Loader.toRelative"></a>

## Loader.toRelative(rootDir, target) ⇒ <code>external.Promise</code>

Converts absolute path to relative path.

**Kind**: static method of [<code>Loader</code>](#module_system..Loader)  
**Returns**: <code>external.Promise</code> - Relative path|paths.  

| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>string</code> | Absolute folder. |
| target | <code>string</code> \| <code>Array.&lt;string&gt;</code> | File/folder name|names. |

<a name="module_system..Loader.join"></a>

## Loader.join(rootDir, target) ⇒ <code>external.Promise</code>

Convert a file/folder or array of files/folders to absolute(system absolute) path.

**Kind**: static method of [<code>Loader</code>](#module_system..Loader)  
**Returns**: <code>external.Promise</code> - Absolute path|paths.  

| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>string</code> | Root folder. |
| target | <code>string</code> \| <code>Array.&lt;string&gt;</code> | File/folder name|names. |

<a name="module_system..Loader.isFile"></a>

## Loader.isFile(rootDir, relativeDir, filename) ⇒ <code>boolean</code>

Checks if is a file

**Kind**: static method of [<code>Loader</code>](#module_system..Loader)  
**Returns**: <code>boolean</code> - Returns `true` if a file, `false` if not.  

| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>string</code> | Absolute root directory. |
| relativeDir | <code>string</code> | Relative directory to root. |
| filename | <code>string</code> | Full filename. |

<a name="module_system..Loader.isDir"></a>

## Loader.isDir(rootDir, relativeDir) ⇒ <code>boolean</code>

Checks if is a directory.

**Kind**: static method of [<code>Loader</code>](#module_system..Loader)  
**Returns**: <code>boolean</code> - Returns `true` if a directory, `false` if not.  

| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>string</code> | Absolute root directory. |
| relativeDir | <code>string</code> | Relative directory to root. |

<a name="module_system..Loader.list"></a>

## Loader.list(rootDir, relativeDir) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Returns an array of strings, representing the contents of a folder.

**Kind**: static method of [<code>Loader</code>](#module_system..Loader)  
**Returns**: [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) - Array with contents; Rejects with errors from [fs.readdir](https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback).  

| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>string</code> | Root directory. |
| relativeDir | <code>string</code> | Relative directory. |

<a name="module_system..Loader.yamlToObject"></a>

## Loader.yamlToObject(string) ⇒ <code>Object</code>

Converts YAML string to a JS object.

**Kind**: static method of [<code>Loader</code>](#module_system..Loader)  
**Returns**: <code>Object</code> - Javascript object.  

| Param | Type | Description |
| --- | --- | --- |
| string | <code>string</code> | YAML string. |

<a name="module_system..Loader..initRecursion"></a>

## Loader~initRecursion(rootDir, relativePath, initFilename, targetObject, extend) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

System loader recursion.

Note:

- Default values are assumed for unspecified or empty values.
- Extension means recursive loading of data into variable, as if loading a new file into the current variable as new system.
- Relative path is relative to the directory location of current file.

**Kind**: inner method of [<code>Loader</code>](#module_system..Loader)  
**Throws**:

- Will throw an error if the directive is not an allowed one (folder, file, path, extend).


| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>string</code> | Root directory. |
| relativePath | <code>Object</code> | Relative path. |
| initFilename | <code>string</code> | Filename for settings. |
| targetObject | <code>Object</code> | Object to be filled. |
| extend | <code>boolean</code> | Extend the children objects or not. |

**Example** *(Default filename - null)*  
```yaml
# Variable settings to be populated with data from "system_root_dir/settings.yml"
settings: # Defaults to "settings"
```
**Example** *(Default filename - empty string)*  
```yaml
# Variable settings to be populated with data from "system_root_dir/settings.yml"
settings: "" # Defaults to "settings"
```
**Example** *(Specified filename)*  
```yaml
# Variable settings to be populated with data from "system_root_dir/xxx.yml"
settings: "xxx"
```
**Example** *(Default values)*  
```yaml
# Variable settings to be populated with data from "system_root_dir/settings.yml"
settings:
  folder: # Defaults to "./"
  file: # Defaults to "settings"
  path: # Defaults to "absolute"
  extend: # Defaults to "false"
```
**Example** *(Specified values)*  
```yaml
# Variable settings to be populated with data from "current_dir/hello/xxx.yml"
settings:
  folder: "hello"
  file: xxx
  path: relative
  extend: false
```
**Example** *(Extension)*  
```yaml
# Variable settings to be populated **recursively** with data from "current_dir/hello/xxx.yml"
settings:
  folder: "hello"
  file: xxx
  path: relative
  extend: true
```
<a name="module_system..Loader..initSettings"></a>

## Loader~initSettings(rootDir, initPath, filename) ⇒ <code>Object</code>

Init and populate globalspace with settings - specific global object member per file.
Semantically this function has broader purpose than loadYaml.

**Kind**: inner method of [<code>Loader</code>](#module_system..Loader)  
**Returns**: <code>Object</code> - Javascript object with settings.  

| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>string</code> | Root directory. |
| initPath | <code>string</code> | Relative directory to root. |
| filename | <code>string</code> | Filename. |

<a name="module_system..Loader..loadYaml"></a>

## Loader~loadYaml(rootDir, relativeDir, filename) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Parses YAML file, and returns and object; Adds extension if absent.

**Kind**: inner method of [<code>Loader</code>](#module_system..Loader)  
**Returns**: [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) - Javascript object.  

| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>string</code> | Absolute directory path. |
| relativeDir | <code>string</code> | Relative directory to root. |
| filename | <code>string</code> | Filename, with or without extension. |

<a name="module_system..SystemError"></a>

## system~SystemError ⇐ <code>external:error</code>

Extended system error class.

**Kind**: inner class of [<code>system</code>](#module_system)  
**Extends**: <code>external:error</code>  

* [~SystemError](#module_system..SystemError) ⇐ <code>external:error</code>
    * [new SystemError(code, message)](#new_module_system..SystemError_new)
    * _instance_
        * [.code](#module_system..SystemError+code) : <code>string</code> ℗
    * _static_
        * [.isSystemError(error)](#module_system..SystemError.isSystemError) ⇒ <code>boolean</code>

<a name="new_module_system..SystemError_new"></a>

## new SystemError(code, message)

Creates an instance of SystemError.


| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> | Error code |
| message | <code>string</code> | Error message |

<a name="module_system..SystemError+code"></a>

## systemError.code : <code>string</code> ℗

Error code.

**Kind**: instance property of [<code>SystemError</code>](#module_system..SystemError)  
**Access**: private  
<a name="module_system..SystemError.isSystemError"></a>

## SystemError.isSystemError(error) ⇒ <code>boolean</code>

Check if an object is indeed a functional SystemError.

Note:

- Not checking for presence of code property, or for it being a string, as assuming that the object of SystemError type would have it initialized.
- Empty code errors will return false, due to the ambiguity.

**Kind**: static method of [<code>SystemError</code>](#module_system..SystemError)  
**Returns**: <code>boolean</code> - Returns `true` if is is a SystemError, `false` if not.  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>module:system.SystemError</code> | Error to check |

**Example** *(Usage)*  
```js
// Try to load JSON
try{
	loadJson();
} catch(error) {
	if (SystemError.isSystemError(error)){
		// If error is something that we have defined, throw a more generic error
		throw new SystemError("json_load_fail", "Failed to load JSON file.");
	} else {
		// Rethrow the original error
		throw error;
	}
}
```
<a name="module_system..Behavior"></a>

## system~Behavior ⇐ [<code>EventEmitter</code>](https://nodejs.org/api/events.html#events_class_eventemitter)

System behavior class

**Kind**: inner class of [<code>system</code>](#module_system)  
**Extends**: [<code>EventEmitter</code>](https://nodejs.org/api/events.html#events_class_eventemitter)  

* [~Behavior](#module_system..Behavior) ⇐ [<code>EventEmitter</code>](https://nodejs.org/api/events.html#events_class_eventemitter)
    * [new Behavior()](#new_module_system..Behavior_new)
    * [.atomicLock](#module_system..Behavior+atomicLock) : [<code>AtomicLock</code>](#module_system.AtomicLock) ℗
    * [.behaviorId](#module_system..Behavior+behaviorId) : <code>Object</code> ℗
    * [.behaviorIndex](#module_system..Behavior+behaviorIndex) : <code>Array.&lt;string&gt;</code> ℗
    * [.nextBehaviorCounter](#module_system..Behavior+nextBehaviorCounter) : <code>number</code> ℗
    * [.addBehavior(name, callback)](#module_system..Behavior+addBehavior) ⇒ <code>number</code>
    * [.behave(name)](#module_system..Behavior+behave)

<a name="new_module_system..Behavior_new"></a>

## new Behavior()

Initializes system behavior

<a name="module_system..Behavior+atomicLock"></a>

## behavior.atomicLock : [<code>AtomicLock</code>](#module_system.AtomicLock) ℗

Atomic lock to perform counter increments

**Kind**: instance property of [<code>Behavior</code>](#module_system..Behavior)  
**Access**: private  
<a name="module_system..Behavior+behaviorId"></a>

## behavior.behaviorId : <code>Object</code> ℗

IDs to use as actual event identifiers

**Kind**: instance property of [<code>Behavior</code>](#module_system..Behavior)  
**Access**: private  
<a name="module_system..Behavior+behaviorIndex"></a>

## behavior.behaviorIndex : <code>Array.&lt;string&gt;</code> ℗

Index to link id's back to behavior names

**Kind**: instance property of [<code>Behavior</code>](#module_system..Behavior)  
**Access**: private  
<a name="module_system..Behavior+nextBehaviorCounter"></a>

## behavior.nextBehaviorCounter : <code>number</code> ℗

Counter to use to generate IDs

**Kind**: instance property of [<code>Behavior</code>](#module_system..Behavior)  
**Access**: private  
<a name="module_system..Behavior+addBehavior"></a>

## behavior.addBehavior(name, callback) ⇒ <code>number</code>

Adds a behavior to the behavior class instance.

Note:

Does not check for inconsistencies within ID and index arrays, as if it is internally managed by this class, inconsistencies should not happen.

**Kind**: instance method of [<code>Behavior</code>](#module_system..Behavior)  
**Returns**: <code>number</code> - ID of the behavior; `-1` if creation failed  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the bahavior |
| callback | <code>function</code> | Behavior callback function |

**Example** *(Usage)*  
```js
// Create a new instance of Behavior
var behavior = new Behavior();

// Add a behavior
behavior.addBehavior("hello_behavior", () => console.log("Hello World"));
```
<a name="module_system..Behavior+behave"></a>

## behavior.behave(name)

Triggers behaviors registered for name

**Kind**: instance method of [<code>Behavior</code>](#module_system..Behavior)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Behavior name |

**Example** *(Usage)*  
```js
// Create a new instance of Behavior
var behavior = new Behavior();

// Add a behavior
behavior.addBehavior("hello_behavior", () => console.log("Hello World"));

// Call a behavior
behavior.behave("hello_behavior");

// Output:
// "Hello World"
```
