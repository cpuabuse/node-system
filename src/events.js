// src/events.ts
/*
    Contains list of events used in system.
    Reasons for semantical dereference:
        - Events are fired by string and not by object reference
        - The centralized management of event names is convinient
*/
"use strict";
module.exports = {
    /**
     * Error could not be added, because error with same code already exists.
     * @event module:system.System#events#errorExists
     * @default error_exists
     */
    errorExists: "error_exists",
    /**
     * System load event. Fires at the end of system load, so it is safe to execute code in the then() directive of behavior associated.
     * @event module:system.System#events#systemLoad
     * @default system_load
     */
    systemLoad: "system_load",
    /**
     * Behavior has been attached.
     * @event module:system.System#events#behaviorAttach
     * @default behavior_attach
     */
    behaviorAttach: "behavior_attach",
    /**
     * Behavior could not be attached.
     * @event module:system.System#events#behaviorAttachFail
     * @default behavior_attach_fail
     */
    behaviorAttachFail: "behavior_attach_fail",
    /**
     * Incorrect behavior attach request.
     * @event module:system.System#events#behaviorAttachRequestFail
     * @default behavior_attach_request_fail
     */
    behaviorAttachRequestFail: "behavior_attach_request_fail",
    /**
     * Type error has been encountered.
     * @event module:system.System#events#typeError
     * @default type_error
     */
    typeError: "type_error",
    /**
     * Failed to fire an event.
     * @event module:system.System#events#eventFail
     * @default event_fail
     */
    eventFail: "event_fail"
};
