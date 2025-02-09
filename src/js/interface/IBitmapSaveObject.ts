import type { InstanceObjectImpl } from "./InstanceObjectImpl";

export interface IBitmapSaveObject extends InstanceObjectImpl
{
    imageType: string;
    width?: number;
    height?: number;
    buffer?: string | Uint8Array
}