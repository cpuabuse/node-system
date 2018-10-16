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
        * [.AtomicLock](#module_system.AtomicLock)
            * [new AtomicLock()](#new_module_system.AtomicLock_new)
            * [.locked](#module_system.AtomicLock+locked) : <code>boolean</code> ℗
            * [.lock()](#module_system.AtomicLock+lock) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
            * [.release()](#module_system.AtomicLock+release)
    * _inner_
        * [~System](#module_system..System) ⇐ [<code>SystemLoader</code>](#module_system..SystemLoader)
            * [new System(id, rootDir, relativeInitDir, initFilename, [behaviors])](#new_module_system..System_new)
            * _instance_
                * *[.events](#module_system..System+events) : <code>Object</code>*
                * [.system](#module_system..System+system) : [<code>options</code>](#module_system..System..options)
                    * [.file](#module_system..System+system+file) : <code>Object</code>
                        * [.filter](#module_system..System+system+file+filter)
                            * [.isFile(folder, file)](#module_system..System+system+file+filter+isFile)
                            * [.isDir(dir)](#module_system..System+system+file+filter+isDir)
                        * [.toRelative(rootDir, target)](#module_system..System+system+file+toRelative)
                        * [.join(rootDir, target)](#module_system..System+system+file+join)
                        * [.getFile(dir, file)](#module_system..System+system+file+getFile)
                        * [.list(folder, [filter])](#module_system..System+system+file+list) ⇒ <code>Array.&lt;String&gt;</code>
                * [.addError(code, message)](#module_system..System+addError)
                * [.addBehaviors(behaviors)](#module_system..System+addBehaviors)
                * [.log(text)](#module_system..System+log)
                * [.fire(name, [message])](#module_system..System+fire)
                * [.processNewSystemError(code, message)](#module_system..System+processNewSystemError)
                * [.processError(error)](#module_system..System+processError)
                * [.behave(event)](#module_system..System+behave)
            * _static_
                * [.checkOptionsFailure(options)](#module_system..System.checkOptionsFailure) ⇒ <code>boolean</code>
                * [.error(text)](#module_system..System.error)
                * [.log(text)](#module_system..System.log)
            * _inner_
                * [~options](#module_system..System..options) : <code>Object</code>
        * [~SystemLoader](#module_system..SystemLoader)
            * [new SystemLoader(rootDir, relativeInitDir, initFilename, callback)](#new_module_system..SystemLoader_new)
            * _static_
                * [.getFile(rootDir, relativeDir, file)](#module_system..SystemLoader.getFile) ⇒ <code>external.Promise</code>
                * [.toRelative(rootDir, target)](#module_system..SystemLoader.toRelative) ⇒ <code>external.Promise</code>
                * [.join(rootDir, target)](#module_system..SystemLoader.join) ⇒ <code>external.Promise</code>
                * [.isFile(rootDir, relativeDir, filename)](#module_system..SystemLoader.isFile) ⇒ <code>boolean</code>
                * [.isDir(rootDir, relativeDir)](#module_system..SystemLoader.isDir) ⇒ <code>boolean</code>
                * [.list(rootDir, relativeDir)](#module_system..SystemLoader.list) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
                * [.yamlToObject(string)](#module_system..SystemLoader.yamlToObject) ⇒ <code>object</code>
            * _inner_
                * [~initRecursion(rootDir, relativePath, initFilename, targetObject, extend)](#module_system..SystemLoader..initRecursion) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
                * [~initSettings(rootDir, initPath, filename)](#module_system..SystemLoader..initSettings) ⇒ <code>object</code>
                * [~loadYaml(rootDir, relativeDir, filename)](#module_system..SystemLoader..loadYaml) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
        * [~SystemError](#module_system..SystemError) ⇐ <code>external:error</code>
            * [new SystemError(code, message)](#new_module_system..SystemError_new)
            * [.isSystemError(error)](#module_system..SystemError.isSystemError)
        * [~SystemBehavior](#module_system..SystemBehavior) ⇐ [<code>EventEmitter</code>](https://nodejs.org/api/events.html#events_class_eventemitter)
            * [new SystemBehavior()](#new_module_system..SystemBehavior_new)
            * [.atomicLock](#module_system..SystemBehavior+atomicLock) ℗
            * [.behaviorId](#module_system..SystemBehavior+behaviorId) ℗
            * [.behaviorIndex](#module_system..SystemBehavior+behaviorIndex) ℗
            * [.nextBehaviorCounter](#module_system..SystemBehavior+nextBehaviorCounter) ℗
            * [.addBehavior(name, callback)](#module_system..SystemBehavior+addBehavior) ⇒ <code>number</code>
            * [.behave(name)](#module_system..SystemBehavior+behave)

<a name="module_system.AtomicLock"></a>

## system.AtomicLock

Creates an instance of AtomicLock.

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
<a name="module_system.AtomicLock+release"></a>

## atomicLock.release()

Release atomic lock

**Kind**: instance method of [<code>AtomicLock</code>](#module_system.AtomicLock)  
<a name="module_system..System"></a>

## system~System ⇐ [<code>SystemLoader</code>](#module_system..SystemLoader)

Provides wide range of functionality for file loading and event exchange.

**Kind**: inner class of [<code>system</code>](#module_system)  
**Extends**: [<code>SystemLoader</code>](#module_system..SystemLoader)  
**Emits**: <code>event:system_load Load complete.</code>  

* [~System](#module_system..System) ⇐ [<code>SystemLoader</code>](#module_system..SystemLoader)
    * [new System(id, rootDir, relativeInitDir, initFilename, [behaviors])](#new_module_system..System_new)
    * _instance_
        * *[.events](#module_system..System+events) : <code>Object</code>*
        * [.system](#module_system..System+system) : [<code>options</code>](#module_system..System..options)
            * [.file](#module_system..System+system+file) : <code>Object</code>
                * [.filter](#module_system..System+system+file+filter)
                    * [.isFile(folder, file)](#module_system..System+system+file+filter+isFile)
                    * [.isDir(dir)](#module_system..System+system+file+filter+isDir)
                * [.toRelative(rootDir, target)](#module_system..System+system+file+toRelative)
                * [.join(rootDir, target)](#module_system..System+system+file+join)
                * [.getFile(dir, file)](#module_system..System+system+file+getFile)
                * [.list(folder, [filter])](#module_system..System+system+file+list) ⇒ <code>Array.&lt;String&gt;</code>
        * [.addError(code, message)](#module_system..System+addError)
        * [.addBehaviors(behaviors)](#module_system..System+addBehaviors)
        * [.log(text)](#module_system..System+log)
        * [.fire(name, [message])](#module_system..System+fire)
        * [.processNewSystemError(code, message)](#module_system..System+processNewSystemError)
        * [.processError(error)](#module_system..System+processError)
        * [.behave(event)](#module_system..System+behave)
    * _static_
        * [.checkOptionsFailure(options)](#module_system..System.checkOptionsFailure) ⇒ <code>boolean</code>
        * [.error(text)](#module_system..System.error)
        * [.log(text)](#module_system..System.log)
    * _inner_
        * [~options](#module_system..System..options) : <code>Object</code>

<a name="new_module_system..System_new"></a>

## new System(id, rootDir, relativeInitDir, initFilename, [behaviors])

**Throws**:

- [<code>Error</code>](https://nodejs.org/api/errors.html#errors_class_error) Throws standard error if failed to perform basic initializations, or system failure that cannot be reported otherwise has occured.

- `loader_failed` - Loader did not construct the property

**Note**: typeof SystemError will return false


| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | System instace internal ID |
| rootDir | <code>String</code> | The root directory for the System instance |
| relativeInitDir | <code>String</code> | The relative directory to root of the location of the initialization file |
| initFilename | <code>String</code> | Initialization file filename |
| [behaviors] | <code>module:system.System~behavior</code> | [Optional] Behaviors to add |

**Example** *(Behaviors outline)*  
```js
amazing_behavior: () => {
  // Process system instance on "amazing_behavior"
  amazingProcessor(this);
}
```
<a name="module_system..System+events"></a>

## *system.events : <code>Object</code>*

Events to be populated by the loader.
System by itself does not do anything about the events themselves, it only confirms that the events were initialized. Ofcourse, if the events are fired, and failure to fire event is set to throw, or undocumented events encountered, it would make troubles(System and standard throws).

**Kind**: instance abstract property of [<code>System</code>](#module_system..System)  
<a name="module_system..System+system"></a>

## system.system : [<code>options</code>](#module_system..System..options)

Contains system info.

**Kind**: instance property of [<code>System</code>](#module_system..System)  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| behavior | [<code>SystemBehavior</code>](#module_system..SystemBehavior) | Event emitter for the behaviors. Generally should use the public system instance methods instead. |
| error | <code>object</code> | Contains throwables |
| error | <code>module:system~System~file</code> | Contains throwables |


* [.system](#module_system..System+system) : [<code>options</code>](#module_system..System..options)
    * [.file](#module_system..System+system+file) : <code>Object</code>
        * [.filter](#module_system..System+system+file+filter)
            * [.isFile(folder, file)](#module_system..System+system+file+filter+isFile)
            * [.isDir(dir)](#module_system..System+system+file+filter+isDir)
        * [.toRelative(rootDir, target)](#module_system..System+system+file+toRelative)
        * [.join(rootDir, target)](#module_system..System+system+file+join)
        * [.getFile(dir, file)](#module_system..System+system+file+getFile)
        * [.list(folder, [filter])](#module_system..System+system+file+list) ⇒ <code>Array.&lt;String&gt;</code>

<a name="module_system..System+system+file"></a>

## system.file : <code>Object</code>

File system methods

**Kind**: instance property of [<code>system</code>](#module_system..System+system)  

* [.file](#module_system..System+system+file) : <code>Object</code>
    * [.filter](#module_system..System+system+file+filter)
        * [.isFile(folder, file)](#module_system..System+system+file+filter+isFile)
        * [.isDir(dir)](#module_system..System+system+file+filter+isDir)
    * [.toRelative(rootDir, target)](#module_system..System+system+file+toRelative)
    * [.join(rootDir, target)](#module_system..System+system+file+join)
    * [.getFile(dir, file)](#module_system..System+system+file+getFile)
    * [.list(folder, [filter])](#module_system..System+system+file+list) ⇒ <code>Array.&lt;String&gt;</code>

<a name="module_system..System+system+file+filter"></a>

## file.filter

File level filters

**Kind**: instance property of [<code>file</code>](#module_system..System+system+file)  

* [.filter](#module_system..System+system+file+filter)
    * [.isFile(folder, file)](#module_system..System+system+file+filter+isFile)
    * [.isDir(dir)](#module_system..System+system+file+filter+isDir)

<a name="module_system..System+system+file+filter+isFile"></a>

## filter.isFile(folder, file)

Check if argument is a file (relative to system root directory)

**Kind**: instance method of [<code>filter</code>](#module_system..System+system+file+filter)  

| Param | Type | Description |
| --- | --- | --- |
| folder | <code>String</code> | Root folder |
| file | <code>String</code> | File or folder within root |

<a name="module_system..System+system+file+filter+isDir"></a>

## filter.isDir(dir)

Check if argument is a folder (relative to system root directory)

**Kind**: instance method of [<code>filter</code>](#module_system..System+system+file+filter)  

| Param | Type | Description |
| --- | --- | --- |
| dir | <code>String</code> | Folder |

<a name="module_system..System+system+file+toRelative"></a>

## file.toRelative(rootDir, target)

Converts absolute path to relative path

**Kind**: instance method of [<code>file</code>](#module_system..System+system+file)  

| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>String</code> | Relative directory |
| target | <code>String</code> | Absolute file/folder path |

<a name="module_system..System+system+file+join"></a>

## file.join(rootDir, target)

Joins two paths

**Kind**: instance method of [<code>file</code>](#module_system..System+system+file)  

| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>String</code> | Relative directory |
| target | <code>String</code> | File/folder path to rootDir |

<a name="module_system..System+system+file+getFile"></a>

## file.getFile(dir, file)

Get file contents relative to system\ root directory

**Kind**: instance method of [<code>file</code>](#module_system..System+system+file)  

| Param | Type | Description |
| --- | --- | --- |
| dir | <code>String</code> | Directory, relative to system root |
| file | <code>String</code> | Filename |

<a name="module_system..System+system+file+list"></a>

## file.list(folder, [filter]) ⇒ <code>Array.&lt;String&gt;</code>

List the contents of the folder, relative to system root directory.

**Kind**: instance method of [<code>file</code>](#module_system..System+system+file)  
**Returns**: <code>Array.&lt;String&gt;</code> - Filtered files/folders relative to system root  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| folder | <code>String</code> |  | Folder to check |
| [filter] | [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | <code></code> |  |

**Example** *(List folders)*  
```js
systemInstance.system.file.list("css", systemInstance.system.file.filter.isDir);
```
<a name="module_system..System+addError"></a>

## system.addError(code, message)

Adds an error to the System dynamically

**Kind**: instance method of [<code>System</code>](#module_system..System)  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>String</code> | Error code |
| message | <code>String</code> | Error description |

<a name="module_system..System+addBehaviors"></a>

## system.addBehaviors(behaviors)

Adds behaviors to the system, and fires post-addtion events.
Firstly, this function attempts to add the behaviors.
When the behavior addition has been processed, the function will attempt to fire post-addition events, depending on success/failure of behavior additions.
Logically the two stage separation should be done with promises, but due to huge overhead of promises and low total processing required, it will be simplified to syncronous.

**Kind**: instance method of [<code>System</code>](#module_system..System)  
**Emits**: [<code>behavior_attach</code>](#module_system.System..event_behavior_attach), [<code>behavior_attach_fail</code>](#module_system.System..event_behavior_attach_fail), [<code>behavior_attach_request_fail</code>](#module_system.System..event_behavior_attach_request_fail)  

| Param | Type |
| --- | --- |
| behaviors | <code>Array.&lt;module:system.System~behavior&gt;</code> | 

<a name="module_system..System+log"></a>

## system.log(text)

Log message from the System context

**Kind**: instance method of [<code>System</code>](#module_system..System)  
**Emits**: [<code>type_error</code>](#module_system.System..event_type_error)  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>String</code> | Message |

<a name="module_system..System+fire"></a>

## system.fire(name, [message])

Fires a system event

**Kind**: instance method of [<code>System</code>](#module_system..System)  
**Throws**:

- [<code>Error</code>](https://nodejs.org/api/errors.html#errors_class_error) Will throw `error_hell`. The inability to process error - if [module:system.System~event_fail](module:system.System~event_fail) event fails.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Event name, as specified in [module:system.System#events](module:system.System#events). |
| [message] | <code>String</code> | [Optional] Message is not strictly required, but preferred. If not specified, will assume value of the name |

<a name="module_system..System+processNewSystemError"></a>

## system.processNewSystemError(code, message)

Create and process an error

**Kind**: instance method of [<code>System</code>](#module_system..System)  

| Param | Type |
| --- | --- |
| code | <code>String</code> | 
| message | <code>String</code> | 

<a name="module_system..System+processError"></a>

## system.processError(error)

Process a system error - log, behavior or further throw

**Kind**: instance method of [<code>System</code>](#module_system..System)  

| Param | Type | Description |
| --- | --- | --- |
| error | [<code>SystemError</code>](#module_system..SystemError) \| <code>String</code> | SystemError error or error text |

<a name="module_system..System+behave"></a>

## system.behave(event)

Emit an event as a behavior.

**Kind**: instance method of [<code>System</code>](#module_system..System)  

| Param | Type |
| --- | --- |
| event | <code>event</code> | 

<a name="module_system..System.checkOptionsFailure"></a>

## System.checkOptionsFailure(options) ⇒ <code>boolean</code>

Checks options argument for missing incorrect property types

**Kind**: static method of [<code>System</code>](#module_system..System)  
**Returns**: <code>boolean</code> - Returns true if the arguments is corrupt; false if OK  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>options</code>](#module_system..System..options) | System options argument |

<a name="module_system..System.error"></a>

## System.error(text)

Access stderr

**Kind**: static method of [<code>System</code>](#module_system..System)  

| Param | Type |
| --- | --- |
| text | <code>String</code> | 

<a name="module_system..System.log"></a>

## System.log(text)

Access stdout

**Kind**: static method of [<code>System</code>](#module_system..System)  

| Param | Type |
| --- | --- |
| text | <code>String</code> | 

<a name="module_system..System..options"></a>

## System~options : <code>Object</code>

**Kind**: inner typedef of [<code>System</code>](#module_system..System)  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>options</code>](#module_system..System..options) | System options |

<a name="module_system..SystemLoader"></a>

## system~SystemLoader

Required by system to perform file initialization

**Kind**: inner class of [<code>system</code>](#module_system)  

* [~SystemLoader](#module_system..SystemLoader)
    * [new SystemLoader(rootDir, relativeInitDir, initFilename, callback)](#new_module_system..SystemLoader_new)
    * _static_
        * [.getFile(rootDir, relativeDir, file)](#module_system..SystemLoader.getFile) ⇒ <code>external.Promise</code>
        * [.toRelative(rootDir, target)](#module_system..SystemLoader.toRelative) ⇒ <code>external.Promise</code>
        * [.join(rootDir, target)](#module_system..SystemLoader.join) ⇒ <code>external.Promise</code>
        * [.isFile(rootDir, relativeDir, filename)](#module_system..SystemLoader.isFile) ⇒ <code>boolean</code>
        * [.isDir(rootDir, relativeDir)](#module_system..SystemLoader.isDir) ⇒ <code>boolean</code>
        * [.list(rootDir, relativeDir)](#module_system..SystemLoader.list) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
        * [.yamlToObject(string)](#module_system..SystemLoader.yamlToObject) ⇒ <code>object</code>
    * _inner_
        * [~initRecursion(rootDir, relativePath, initFilename, targetObject, extend)](#module_system..SystemLoader..initRecursion) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
        * [~initSettings(rootDir, initPath, filename)](#module_system..SystemLoader..initSettings) ⇒ <code>object</code>
        * [~loadYaml(rootDir, relativeDir, filename)](#module_system..SystemLoader..loadYaml) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

<a name="new_module_system..SystemLoader_new"></a>

## new SystemLoader(rootDir, relativeInitDir, initFilename, callback)

**Throws**:

- [<code>Error</code>](https://nodejs.org/api/errors.html#errors_class_error) Standard error with message


| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>String</code> | Absolute root directory |
| relativeInitDir | <code>String</code> | Relative path to root |
| initFilename | <code>String</code> | Filename |
| callback | <code>function</code> | Callback to call with Promise of completion |

<a name="module_system..SystemLoader.getFile"></a>

## SystemLoader.getFile(rootDir, relativeDir, file) ⇒ <code>external.Promise</code>

Gets file contents

**Kind**: static method of [<code>SystemLoader</code>](#module_system..SystemLoader)  
**Returns**: <code>external.Promise</code> - File contents  

| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>String</code> | Root directory |
| relativeDir | <code>String</code> | Directory relative to root |
| file | <code>String</code> | Full file name |

<a name="module_system..SystemLoader.toRelative"></a>

## SystemLoader.toRelative(rootDir, target) ⇒ <code>external.Promise</code>

Converts absolute path to relative path

**Kind**: static method of [<code>SystemLoader</code>](#module_system..SystemLoader)  
**Returns**: <code>external.Promise</code> - Relative path|paths  

| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>String</code> | Absolute folder |
| target | <code>String</code> \| <code>Array.&lt;String&gt;</code> | File/folder name|names |

<a name="module_system..SystemLoader.join"></a>

## SystemLoader.join(rootDir, target) ⇒ <code>external.Promise</code>

Convert a file/folder or array of files/folders to absolute(system absolute) path.

**Kind**: static method of [<code>SystemLoader</code>](#module_system..SystemLoader)  
**Returns**: <code>external.Promise</code> - Absolute path|paths  

| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>String</code> | Root folder |
| target | <code>String</code> \| <code>Array.&lt;String&gt;</code> | File/folder name|names |

<a name="module_system..SystemLoader.isFile"></a>

## SystemLoader.isFile(rootDir, relativeDir, filename) ⇒ <code>boolean</code>

Checks if is a file

**Kind**: static method of [<code>SystemLoader</code>](#module_system..SystemLoader)  
**Returns**: <code>boolean</code> - Returns `true` if a file, `false` if not  

| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>Sstring</code> | Absolute root directory |
| relativeDir | <code>Sstring</code> | Relative directory to root |
| filename | <code>Sstring</code> | Full filename |

<a name="module_system..SystemLoader.isDir"></a>

## SystemLoader.isDir(rootDir, relativeDir) ⇒ <code>boolean</code>

Checks if is a directory

**Kind**: static method of [<code>SystemLoader</code>](#module_system..SystemLoader)  
**Returns**: <code>boolean</code> - Returns `true` if a directory, `false` if not  

| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>String</code> | Absolute root directory |
| relativeDir | <code>String</code> | Relative directory to root |

<a name="module_system..SystemLoader.list"></a>

## SystemLoader.list(rootDir, relativeDir) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Returns an array of strings, representing the contents of a folder

**Kind**: static method of [<code>SystemLoader</code>](#module_system..SystemLoader)  
**Returns**: [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) - Array with contents; Rejects with errors from https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback  

| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>Sting</code> | Root directory |
| relativeDir | <code>String</code> | Relative directory |

<a name="module_system..SystemLoader.yamlToObject"></a>

## SystemLoader.yamlToObject(string) ⇒ <code>object</code>

Converts YAML string to a JS object

**Kind**: static method of [<code>SystemLoader</code>](#module_system..SystemLoader)  
**Returns**: <code>object</code> - Javascript object  

| Param | Type | Description |
| --- | --- | --- |
| string | <code>String</code> | YAML string |

<a name="module_system..SystemLoader..initRecursion"></a>

## SystemLoader~initRecursion(rootDir, relativePath, initFilename, targetObject, extend) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

**Kind**: inner method of [<code>SystemLoader</code>](#module_system..SystemLoader)  

| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>String</code> | Root directory |
| relativePath | <code>object</code> | Relative path |
| initFilename | <code>String</code> | Filename for settings |
| targetObject | <code>object</code> | Object to be filled |
| extend | <code>boolean</code> | Extend the children objects or not |

**Example** *(Default filename - null)*  
```yaml
# Variable settings to be populated with data from "system_root_dir/settings.yml"
[settings:]
```
**Example** *(Default filename - empty string)*  
```yaml
# Variable to be assigned an empty string
[settings: ""]
```
**Example** *(Specified filename)*  
```yaml
# Variable settings to be populated with data from "system_root_dir/xxx.yml"
[settings: "xxx"]
```
**Example** *(Default extension)*  
```yaml
# The "extension"(recursion) with default variables will be assumed, so that variable "settings" will be recursively populated with files in "system_root_dir/settings.yml"
settings:
  folder:
  file:
  path: # Note: path may be either absolute(default) or relative(relative to the folder from which the file containing instructions is read), the system will not read files outside of system_root_dir tree.
```
**Example** *(Specified extension)*  
```yaml
# The  "extension"(recursion) with only specified variables will be performed, in this example "settings" variable will be populated with the files described in the "system_root_dir/hello/settings.yml"
settings:
  folder: "hello"
  file:
  path: # Note: path may be either absolute(default) or relative(relative to the folder from which the file containing instructions is read), the system will not read files outside of system_root_dir tree.
```
<a name="module_system..SystemLoader..initSettings"></a>

## SystemLoader~initSettings(rootDir, initPath, filename) ⇒ <code>object</code>

Init and populate globalspace with settings - specific global object member per file.
Semantically this function has broader purpose than loadYaml.

**Kind**: inner method of [<code>SystemLoader</code>](#module_system..SystemLoader)  
**Returns**: <code>object</code> - Javascript object with settings  

| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>String</code> | Root directory |
| initPath | <code>String</code> | Relative directory to root |
| filename | <code>String</code> | Filename |

<a name="module_system..SystemLoader..loadYaml"></a>

## SystemLoader~loadYaml(rootDir, relativeDir, filename) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Parses YAML file, and returns and object; Adds extension if absent

**Kind**: inner method of [<code>SystemLoader</code>](#module_system..SystemLoader)  
**Returns**: [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) - Javascript object  

| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>String</code> | Absolute directory path |
| relativeDir | <code>String</code> | Relative directory to root |
| filename | <code>String</code> | Filename, with or without extension |

<a name="module_system..SystemError"></a>

## system~SystemError ⇐ <code>external:error</code>

Extended system error class.
Creates an instance of SystemError.

**Kind**: inner class of [<code>system</code>](#module_system)  
**Extends**: <code>external:error</code>  

* [~SystemError](#module_system..SystemError) ⇐ <code>external:error</code>
    * [new SystemError(code, message)](#new_module_system..SystemError_new)
    * [.isSystemError(error)](#module_system..SystemError.isSystemError)

<a name="new_module_system..SystemError_new"></a>

## new SystemError(code, message)

**Throws**:

- [<code>Error</code>](https://nodejs.org/api/errors.html#errors_class_error) Throwing error if the code already defined


| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> | Error code |
| message | <code>string</code> | Error message |

<a name="module_system..SystemError.isSystemError"></a>

## SystemError.isSystemError(error)

Check if an object is indeed a functional SystemError

**Kind**: static method of [<code>SystemError</code>](#module_system..SystemError)  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>module:system.SystemError</code> | Error to check |

<a name="module_system..SystemBehavior"></a>

## system~SystemBehavior ⇐ [<code>EventEmitter</code>](https://nodejs.org/api/events.html#events_class_eventemitter)

System behavior class

**Kind**: inner class of [<code>system</code>](#module_system)  
**Extends**: [<code>EventEmitter</code>](https://nodejs.org/api/events.html#events_class_eventemitter)  

* [~SystemBehavior](#module_system..SystemBehavior) ⇐ [<code>EventEmitter</code>](https://nodejs.org/api/events.html#events_class_eventemitter)
    * [new SystemBehavior()](#new_module_system..SystemBehavior_new)
    * [.atomicLock](#module_system..SystemBehavior+atomicLock) ℗
    * [.behaviorId](#module_system..SystemBehavior+behaviorId) ℗
    * [.behaviorIndex](#module_system..SystemBehavior+behaviorIndex) ℗
    * [.nextBehaviorCounter](#module_system..SystemBehavior+nextBehaviorCounter) ℗
    * [.addBehavior(name, callback)](#module_system..SystemBehavior+addBehavior) ⇒ <code>number</code>
    * [.behave(name)](#module_system..SystemBehavior+behave)

<a name="new_module_system..SystemBehavior_new"></a>

## new SystemBehavior()

Initializes system behavior

<a name="module_system..SystemBehavior+atomicLock"></a>

## systemBehavior.atomicLock ℗

Atomic lock to perform counter increments

**Kind**: instance property of [<code>SystemBehavior</code>](#module_system..SystemBehavior)  
**Access**: private  
<a name="module_system..SystemBehavior+behaviorId"></a>

## systemBehavior.behaviorId ℗

ID to use as actual event identifier

**Kind**: instance property of [<code>SystemBehavior</code>](#module_system..SystemBehavior)  
**Access**: private  
<a name="module_system..SystemBehavior+behaviorIndex"></a>

## systemBehavior.behaviorIndex ℗

Index to link id's back to behavior names

**Kind**: instance property of [<code>SystemBehavior</code>](#module_system..SystemBehavior)  
**Access**: private  
<a name="module_system..SystemBehavior+nextBehaviorCounter"></a>

## systemBehavior.nextBehaviorCounter ℗

Counter to use to generate IDs

**Kind**: instance property of [<code>SystemBehavior</code>](#module_system..SystemBehavior)  
**Access**: private  
<a name="module_system..SystemBehavior+addBehavior"></a>

## systemBehavior.addBehavior(name, callback) ⇒ <code>number</code>

Adds a behavior to the behavior class instance.
Does not check for inconsistencies within ID and index arrays, as if it is internally managed by this class, inconsistencies should not happen.

**Kind**: instance method of [<code>SystemBehavior</code>](#module_system..SystemBehavior)  
**Returns**: <code>number</code> - ID of the behavior; -1 if creation failed  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the bahavior |
| callback | <code>function</code> | Behavior callback function |

<a name="module_system..SystemBehavior+behave"></a>

## systemBehavior.behave(name)

Triggers behaviors registered for name

**Kind**: instance method of [<code>SystemBehavior</code>](#module_system..SystemBehavior)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Behavior name |

