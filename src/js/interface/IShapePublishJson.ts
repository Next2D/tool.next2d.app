import type { IBounds } from "./IBounds";
import type { IGrid } from "./IGrid";

export interface IShapePublishJson
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