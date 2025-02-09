import type { IInstanceObject } from "./IInstanceObject";

export interface IVideoSaveObject extends IInstanceObject
{
    buffer?: Uint8Array | string;
    width?: number;
    height?: number;
    volume?: number;
    loop?: boolean;
    autoPlay?: boolean;
}