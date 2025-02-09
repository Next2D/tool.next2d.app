import { IBounds } from "./IBounds";
import { IGrid } from "./IGrid";

export interface ShapePublishJsonImpl
{
    symbol?: string;
    extends: string;
    bounds: IBounds;
    buffer?: number[];
    bitmapId?: number;
    grid?: IGrid;
    inBitmap?: boolean;
    recodes: any[];
}