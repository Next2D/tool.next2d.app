import type { IFolderSaveObject } from "./IFolderSaveObject";
import type { MovieClipSaveObjectImpl } from "./MovieClipSaveObjectImpl";
import type { IBitmapSaveObject } from "./IBitmapSaveObject";
import type { VideoSaveObjectImpl } from "./VideoSaveObjectImpl";
import type { SoundSaveObjectImpl } from "./SoundSaveObjectImpl";

export type InstanceSaveObjectImpl = MovieClipSaveObjectImpl
    | IFolderSaveObject
    | IBitmapSaveObject
    | VideoSaveObjectImpl
    | SoundSaveObjectImpl;