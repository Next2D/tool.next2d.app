import type { IBounds } from "./IBounds";
import type { IInstanceObject } from "./IInstanceObject";

export interface IShapeSaveObject extends IInstanceObject
{
    inBitmap?: boolean;
    recodes?: any[];
    bounds?: IBounds;
}