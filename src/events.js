// events.js
/*
	Contains list of errors used in system.
*/
"use strict";

/** @event module:system.System~behavior_attach */
/** @event module:system.System~behavior_attach_fail */
/** @event module:system.System~behavior_attach_request_fail */
/** @event module:system.System~type_error */
/** @event module:system.System~event_fail */

module.exports = {
	/**
	 * Error could not be added, because error with same code already exists.
 	 * @event module:system.System#events#errorExists
	 * @default error_exists
	 */
	errorExists: "error_exists",
	/**
	 * System load event.
	 * Fires at the end of system load, so it is safe to execute code in the then() directive of behavior associated.
	 * @event module:system.System#events#systemLoad
	 * @default system_load
	 */
	systemLoad: "system_load"
};