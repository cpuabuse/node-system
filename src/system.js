// system/system.js
/**
 * System is intended more than anything, for centralized managment.
 * 
 * **Files & Data**
 * - Default file extension is added, if missing
 * - For empty value in key/value pair, value equal to key is assumed
 * - In absent key/value child pairs, default values for missing keys are assumed
 * 
 * **JSDoc - Member Declaration**
 * 
 * Type | Selector | Declaration
 * ---|---|---
 * static | `.` | Default
 * inner | `~` | `@inner`<br>`@memberof module:myModule~myMember`
 * instance | `#` | `@instance`
 * @module system
 */
"use strict";