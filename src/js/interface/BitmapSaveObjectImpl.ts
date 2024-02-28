import type { InstanceObjectImpl } from "./InstanceObjectImpl";

export interface BitmapSaveObjectImpl extends InstanceObjectImpl
{
    imageType: string;
    width?: number;
    height?: number;
    buffer?: string | Uint8Array
}