import type { FolderSaveObjectImpl } from "./FolderSaveObjectImpl";
import type { MovieClipSaveObjectImpl } from "./MovieClipSaveObjectImpl";
import type { BitmapSaveObjectImpl } from "./BitmapSaveObjectImpl";
import type { VideoSaveObjectImpl } from "./VideoSaveObjectImpl";
import type { SoundSaveObjectImpl } from "./SoundSaveObjectImpl";

export type InstanceSaveObjectImpl = MovieClipSaveObjectImpl
    | FolderSaveObjectImpl
    | BitmapSaveObjectImpl
    | VideoSaveObjectImpl
    | SoundSaveObjectImpl;