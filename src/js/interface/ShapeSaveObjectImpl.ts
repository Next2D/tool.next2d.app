import type { BoundsImpl } from "./BoundsImpl";
import type { InstanceObjectImpl } from "./InstanceObjectImpl";

export interface ShapeSaveObjectImpl extends InstanceObjectImpl
{
    inBitmap?: boolean;
    recodes?: any[];
    bounds?: BoundsImpl;
}