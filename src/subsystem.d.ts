import { System } from "./system";
export interface ConstructorArgs {
    systemContext: System;
    args: any;
}
export declare type SubsystemMethod = {
    name: string;
    fn: Function;
};
declare type Method = {
    [key: string]: Function;
};
export declare class Subsystem {
    system: System;
    method: Method;
    constructor(systemContext: System, subsystemMethods: Array<SubsystemMethod>);
}
export {};
