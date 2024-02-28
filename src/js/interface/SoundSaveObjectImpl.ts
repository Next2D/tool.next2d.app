import type { InstanceObjectImpl } from "./InstanceObjectImpl";

export interface SoundSaveObjectImpl extends InstanceObjectImpl
{
    buffer?: Uint8Array | string;
    volume?: number;
    loopCount?: number;
}