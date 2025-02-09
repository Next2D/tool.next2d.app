import type { IBounds } from "./IBounds";
import type { InstanceObjectImpl } from "./InstanceObjectImpl";

export interface ShapeSaveObjectImpl extends InstanceObjectImpl
{
    inBitmap?: boolean;
    recodes?: any[];
    bounds?: IBounds;
}