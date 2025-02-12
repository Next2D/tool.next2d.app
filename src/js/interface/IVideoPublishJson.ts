import type { IBounds } from "./IBounds";

export interface IVideoPublishJson
{
    symbol?: string;
    extends: string;
    volume: number;
    loop: boolean;
    autoPlay: boolean;
    bounds: IBounds;
    buffer: number[];
}