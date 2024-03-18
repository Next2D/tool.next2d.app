import type { BitmapSaveObjectImpl } from "./BitmapSaveObjectImpl";
import type { MovieClipSaveObjectImpl } from "./MovieClipSaveObjectImpl";
import type { SoundSaveObjectImpl } from "./SoundSaveObjectImpl";
import type { VideoSaveObjectImpl } from "./VideoSaveObjectImpl";

export type AllSaveObjectImpl = BitmapSaveObjectImpl | VideoSaveObjectImpl | SoundSaveObjectImpl | MovieClipSaveObjectImpl;