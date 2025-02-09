import type { IInstanceObject } from "./IInstanceObject";

export interface ISoundSaveObject extends IInstanceObject
{
    buffer?: Uint8Array | string;
    volume?: number;
    loopCount?: number;
}