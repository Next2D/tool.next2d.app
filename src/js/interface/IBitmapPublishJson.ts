import type { IBounds } from "./IBounds";

export interface IBitmapPublishJson
{
    symbol?: string;
    extends: string;
    buffer: number[];
    bounds: IBounds;
}