[![Build Status](https://travis-ci.com/cpuabuse/node-system.svg?branch=master)](https://travis-ci.com/cpuabuse/node-system)
[![npm version](https://badge.fury.io/js/cpuabuse-system.svg)](https://badge.fury.io/js/cpuabuse-system)

# System

<a name="module_system"></a>

## system
System is intended more than anything, for centralized managment.

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


* [system](#module_system)
    * [~SystemLoader](#module_system..SystemLoader)
        * [new SystemLoader(rootDir, relativeInitDir, initFilename)](#new_module_system..SystemLoader_new)
        * _instance_
            * [.data](#module_system..SystemLoader+data) : [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
        * _static_
            * [.getFile(folder, file)](#module_system..SystemLoader.getFile) ⇒ <code>external.Promise</code>
            * [.toRelative(absoluteDir, absoluteFile)](#module_system..SystemLoader.toRelative) ⇒ <code>external.Promise</code>
            * [.toAbsolute(relativeDir, file)](#module_system..SystemLoader.toAbsolute) ⇒ <code>external.Promise</code>
            * [.isFile(rootDir, relativeDir, filename)](#module_system..SystemLoader.isFile) ⇒ <code>boolean</code>
            * [.isDir(rootDir, relativeDir)](#module_system..SystemLoader.isDir) ⇒ <code>boolean</code>
            * [.list(rootDir, relativeDir)](#module_system..SystemLoader.list) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
            * [.yamlToObject(string)](#module_system..SystemLoader.yamlToObject) ⇒ <code>object</code>
        * _inner_
            * [~initRecursion(rootDir, relativePath, initFilename, targetObject)](#module_system..SystemLoader..initRecursion) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
            * [~initSettings(initPath, filename)](#module_system..SystemLoader..initSettings) ⇒ <code>object</code>
            * [~loadYaml(directory, filename)](#module_system..SystemLoader..loadYaml) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
    * [~SystemError](#module_system..SystemError) ⇐ [<code>Error</code>](https://nodejs.org/api/errors.html#errors_class_error)
        * [new SystemError(systemContext, code, message)](#new_module_system..SystemError_new)

<a name="module_system..SystemLoader"></a>

### system~SystemLoader
Required by system to perform file initialization

**Kind**: inner class of [<code>system</code>](#module_system)  

* [~SystemLoader](#module_system..SystemLoader)
    * [new SystemLoader(rootDir, relativeInitDir, initFilename)](#new_module_system..SystemLoader_new)
    * _instance_
        * [.data](#module_system..SystemLoader+data) : [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
    * _static_
        * [.getFile(folder, file)](#module_system..SystemLoader.getFile) ⇒ <code>external.Promise</code>
        * [.toRelative(absoluteDir, absoluteFile)](#module_system..SystemLoader.toRelative) ⇒ <code>external.Promise</code>
        * [.toAbsolute(relativeDir, file)](#module_system..SystemLoader.toAbsolute) ⇒ <code>external.Promise</code>
        * [.isFile(rootDir, relativeDir, filename)](#module_system..SystemLoader.isFile) ⇒ <code>boolean</code>
        * [.isDir(rootDir, relativeDir)](#module_system..SystemLoader.isDir) ⇒ <code>boolean</code>
        * [.list(rootDir, relativeDir)](#module_system..SystemLoader.list) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
        * [.yamlToObject(string)](#module_system..SystemLoader.yamlToObject) ⇒ <code>object</code>
    * _inner_
        * [~initRecursion(rootDir, relativePath, initFilename, targetObject)](#module_system..SystemLoader..initRecursion) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
        * [~initSettings(initPath, filename)](#module_system..SystemLoader..initSettings) ⇒ <code>object</code>
        * [~loadYaml(directory, filename)](#module_system..SystemLoader..loadYaml) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

<a name="new_module_system..SystemLoader_new"></a>

#### new SystemLoader(rootDir, relativeInitDir, initFilename)
**Throws**:

- [<code>Error</code>](https://nodejs.org/api/errors.html#errors_class_error) Standard error with message


| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>string</code> | Absolute root directory |
| relativeInitDir | <code>string</code> | Relative path to root |
| initFilename | <code>string</code> | Filename |

<a name="module_system..SystemLoader+data"></a>

#### systemLoader.data : [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Promise containing result of loading

**Kind**: instance property of [<code>SystemLoader</code>](#module_system..SystemLoader)  
<a name="module_system..SystemLoader.getFile"></a>

#### SystemLoader.getFile(folder, file) ⇒ <code>external.Promise</code>
Gets file contents

**Kind**: static method of [<code>SystemLoader</code>](#module_system..SystemLoader)  
**Returns**: <code>external.Promise</code> - File contents  

| Param | Type | Description |
| --- | --- | --- |
| folder | <code>string</code> | Absolute file location |
| file | <code>string</code> | Full file name |

<a name="module_system..SystemLoader.toRelative"></a>

#### SystemLoader.toRelative(absoluteDir, absoluteFile) ⇒ <code>external.Promise</code>
Converts absolute path to relative path

**Kind**: static method of [<code>SystemLoader</code>](#module_system..SystemLoader)  
**Returns**: <code>external.Promise</code> - Relative path|paths  

| Param | Type | Description |
| --- | --- | --- |
| absoluteDir | <code>string</code> | Absolute file location |
| absoluteFile | <code>string</code> \| <code>Array.&lt;string&gt;</code> | File name|names |

<a name="module_system..SystemLoader.toAbsolute"></a>

#### SystemLoader.toAbsolute(relativeDir, file) ⇒ <code>external.Promise</code>
Convert a file/folder or array of files/folders to absolute(system absolute) path.

**Kind**: static method of [<code>SystemLoader</code>](#module_system..SystemLoader)  
**Returns**: <code>external.Promise</code> - Absolute path|paths  

| Param | Type | Description |
| --- | --- | --- |
| relativeDir | <code>string</code> | Relative file location |
| file | <code>string</code> \| <code>Array.&lt;string&gt;</code> | File name|names |

<a name="module_system..SystemLoader.isFile"></a>

#### SystemLoader.isFile(rootDir, relativeDir, filename) ⇒ <code>boolean</code>
Checks if is a file

**Kind**: static method of [<code>SystemLoader</code>](#module_system..SystemLoader)  
**Returns**: <code>boolean</code> - Returns `true` if a file, `false` if not  

| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>string</code> | Absolute root directory |
| relativeDir | <code>string</code> | Relative directory to root |
| filename | <code>string</code> | Full filename |

<a name="module_system..SystemLoader.isDir"></a>

#### SystemLoader.isDir(rootDir, relativeDir) ⇒ <code>boolean</code>
Checks if is a directory

**Kind**: static method of [<code>SystemLoader</code>](#module_system..SystemLoader)  
**Returns**: <code>boolean</code> - Returns `true` if a directory, `false` if not  

| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>string</code> | Absolute root directory |
| relativeDir | <code>string</code> | Relative directory to root |

<a name="module_system..SystemLoader.list"></a>

#### SystemLoader.list(rootDir, relativeDir) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Returns an array of strings, representing the contents of a folder

**Kind**: static method of [<code>SystemLoader</code>](#module_system..SystemLoader)  
**Returns**: [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) - Array with contents; Rejects with errors from https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback  

| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>sting</code> | Root directory |
| relativeDir | <code>string</code> | Relative directory |

<a name="module_system..SystemLoader.yamlToObject"></a>

#### SystemLoader.yamlToObject(string) ⇒ <code>object</code>
Converts YAML string to a JS object

**Kind**: static method of [<code>SystemLoader</code>](#module_system..SystemLoader)  
**Returns**: <code>object</code> - Javascript object  

| Param | Type | Description |
| --- | --- | --- |
| string | <code>string</code> | YAML string |

<a name="module_system..SystemLoader..initRecursion"></a>

#### SystemLoader~initRecursion(rootDir, relativePath, initFilename, targetObject) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
**Kind**: inner method of [<code>SystemLoader</code>](#module_system..SystemLoader)  

| Param | Type | Description |
| --- | --- | --- |
| rootDir | <code>string</code> | Root directory |
| relativePath | <code>object</code> | Relative path |
| initFilename | <code>string</code> | Filename for settings |
| targetObject | <code>object</code> | Object to be filled |

**Example** *(Default filename - null)*  
```yaml
# Variable settings to be populated with data from "./settings.yml"
[settings:]
```
**Example** *(Default filename - empty string)*  
```yaml
# Variable settings to be populated with data from "./settings.yml"
[settings: ""]
```
**Example** *(Specified filename)*  
```yaml
# Variable settings to be populated with data from "./xxx.yml"
[settings: "xxx"]
```
**Example** *(Default extension)*  
```yaml
# The "extension"(recursion) with default variables will be assumed, so that variable "settings" will be recursively populated with files located in "settings/settings.yml"
settings:
  folder:
  file:
  name:
  path: # Note: path may be either absolute(default) or relative(relative to the folder from which the file containing instructions is read), the system will not read files outside of system_root_dir tree.
```
**Example** *(Specified extension)*  
```yaml
# The  "extension"(recursion) with only specified variables will be performed, in this example "settings" variable will be populated with the files described in the "system_root_dir/hello/settings.yml"
settings:
  folder: "hello"
  file:
  name:
  path: # Note: path may be either absolute(default) or relative(relative to the folder from which the file containing instructions is read), the system will not read files outside of system_root_dir tree.
```
<a name="module_system..SystemLoader..initSettings"></a>

#### SystemLoader~initSettings(initPath, filename) ⇒ <code>object</code>
Init and populate globalspace with settings - specific global object member per file.
Semantically this function has broader purpose than loadYaml.

**Kind**: inner method of [<code>SystemLoader</code>](#module_system..SystemLoader)  
**Returns**: <code>object</code> - Javascript object with settings  

| Param | Type | Description |
| --- | --- | --- |
| initPath | <code>string</code> | Path to the settings file |
| filename | <code>string</code> | Filename |

<a name="module_system..SystemLoader..loadYaml"></a>

#### SystemLoader~loadYaml(directory, filename) ⇒ [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Parses YAML file, and returns and object; Adds extension if absent

**Kind**: inner method of [<code>SystemLoader</code>](#module_system..SystemLoader)  
**Returns**: [<code>Promise</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) - Javascript object  

| Param | Type | Description |
| --- | --- | --- |
| directory | <code>string</code> | Absolute directory path |
| filename | <code>string</code> | Filename, with or without extension |

<a name="module_system..SystemError"></a>

### system~SystemError ⇐ [<code>Error</code>](https://nodejs.org/api/errors.html#errors_class_error)
Extended system error class.
Creates an instance of SystemError.

**Kind**: inner class of [<code>system</code>](#module_system)  
**Extends**: [<code>Error</code>](https://nodejs.org/api/errors.html#errors_class_error)  
<a name="new_module_system..SystemError_new"></a>

#### new SystemError(systemContext, code, message)
**Throws**:

- [<code>Error</code>](https://nodejs.org/api/errors.html#errors_class_error) Throwing error if the code already defined


| Param | Type | Description |
| --- | --- | --- |
| systemContext | <code>module:system.System</code> | System context |
| code | <code>string</code> | Error code |
| message | <code>string</code> | Error message |

