import { BoundsImpl } from "./BoundsImpl";
import { GridImpl } from "./GridImpl";

export interface ShapePublishJsonImpl
{
    symbol?: string;
    extends: string;
    bounds: BoundsImpl;
    buffer?: number[];
    bitmapId?: number;
    grid?: GridImpl;
    inBitmap?: boolean;
    recodes: any[];
}