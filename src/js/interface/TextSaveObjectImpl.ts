import type { IBounds } from "./IBounds";
import type { InstanceObjectImpl } from "./InstanceObjectImpl";

export interface TextSaveObjectImpl extends InstanceObjectImpl
{
    bounds?: IBounds;
}