import type { IBitmapSaveObject } from "./IBitmapSaveObject";
import type { MovieClipSaveObjectImpl } from "./MovieClipSaveObjectImpl";
import type { SoundSaveObjectImpl } from "./SoundSaveObjectImpl";
import type { VideoSaveObjectImpl } from "./VideoSaveObjectImpl";

export type IAllSaveObject = IBitmapSaveObject | VideoSaveObjectImpl | SoundSaveObjectImpl | MovieClipSaveObjectImpl;