import type { ImageTypeImpl } from "./ImageTypeImpl";
import type { InstanceObjectImpl } from "./InstanceObjectImpl";

export interface BitmapObjectImpl extends InstanceObjectImpl
{
    width?: number;
    height?: number;
    imageType?: ImageTypeImpl;
    buffer?: string
}