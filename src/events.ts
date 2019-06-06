/*    
    File: src/events.ts
    cpuabuse.com
*/

/**
 * Contains list of events used in system.
 *
 * Reasons for semantical dereference:
 *
 * - Events are fired by string and not by object reference
 * - The centralized management of event names is convinient
 */

/** Error could not be added, because error with same code already exists. */
export const errorExists:string = "error_exists";

/** System load event. Fires at the end of system load, so it is safe to execute code in the then() directive of behavior associated. */
export const systemLoad:string = "system_load";

/** Behavior has been attached. */
export const behaviorAttach:string = "behavior_attach";

/** Behavior could not be attached. */
export const behaviorAttachFail:string = "behavior_attach_fail";

/** Incorrect behavior attach request. */
export const behaviorAttachRequestFail:string = "behavior_attach_request_fail";

/** Type error has been encountered. */
export const typeError:string = "type_error";

/** Failed to fire an event. */
export const eventFail:string = "event_fail";