import { System } from "./system";
export declare class Subsystem {
    system: System;
    fn: object;
    vars: object;
    methods: Array<object>;
    constructor(systemContext: System, subsystemConstructor: Function, subsystemContext: object);
}
