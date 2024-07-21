import { BoundsImpl } from "./BoundsImpl";

export interface VideoPublishJsonImpl
{
    symbol?: string;
    extends: string;
    volume: number;
    loop: boolean;
    autoPlay: boolean;
    buffer: number[];
    bounds: BoundsImpl;
}