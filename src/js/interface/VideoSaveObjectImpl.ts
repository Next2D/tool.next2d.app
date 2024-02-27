import type { InstanceObjectImpl } from "./InstanceObjectImpl";

export interface VideoSaveObjectImpl extends InstanceObjectImpl
{
    buffer: Uint8Array | string;
    width?: number;
    height?: number;
    volume?: number;
    loop?: boolean;
    autoPlay?: boolean;
}