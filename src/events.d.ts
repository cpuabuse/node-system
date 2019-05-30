/**
 * Contains list of events used in system.
 *
 * Reasons for semantical dereference:
 *
 * - Events are fired by string and not by object reference
 * - The centralized management of event names is convinient
 */
/** Error could not be added, because error with same code already exists. */
export declare const errorExists: string;
/** System load event. Fires at the end of system load, so it is safe to execute code in the then() directive of behavior associated. */
export declare const systemLoad: string;
/** Behavior has been attached. */
export declare const behaviorAttach: string;
/** Behavior could not be attached. */
export declare const behaviorAttachFail: string;
/** Incorrect behavior attach request. */
export declare const behaviorAttachRequestFail: string;
/** Type error has been encountered. */
export declare const typeError: string;
/** Failed to fire an event. */
export declare const eventFail: string;
