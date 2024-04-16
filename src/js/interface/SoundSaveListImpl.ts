import type { SoundObjectImpl } from "./SoundObjectImpl";

export interface SoundSaveListImpl {
    frame: number;
    sounds: SoundObjectImpl[];
}