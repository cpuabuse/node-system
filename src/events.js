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
/**
 * System load event.
 * Fires at the end of system load, so it is safe to execute code in the then() directive of behavior associated.
 * @event module:system.System#events#system_load
 */
module.exports = {
	errorExists: "error_exists"
};