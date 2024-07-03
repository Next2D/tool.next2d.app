import { BoundsImpl } from "./BoundsImpl";

export interface BitmapPublishJsonImpl
{
    symbol?: string;
    extends: string;
    buffer: number[];
    bounds: BoundsImpl;
}