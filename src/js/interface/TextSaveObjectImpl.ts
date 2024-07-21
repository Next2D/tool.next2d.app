import type { BoundsImpl } from "./BoundsImpl";
import type { InstanceObjectImpl } from "./InstanceObjectImpl";

export interface TextSaveObjectImpl extends InstanceObjectImpl
{
    bounds?: BoundsImpl;
}