import type { InstanceObjectImpl } from "./InstanceObjectImpl";

export interface BitmapSaveObjectImpl extends InstanceObjectImpl
{
    width: number;
    height: number;
    imageType: string;
    buffer?: string | Uint8Array
}