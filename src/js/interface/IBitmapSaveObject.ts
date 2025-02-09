import type { IInstanceObject } from "./IInstanceObject";

export interface IBitmapSaveObject extends IInstanceObject
{
    imageType: string;
    width?: number;
    height?: number;
    buffer?: string | Uint8Array
}