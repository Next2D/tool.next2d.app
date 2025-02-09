import type { IFolderSaveObject } from "./IFolderSaveObject";
import type { IMovieClipSaveObject } from "./IMovieClipSaveObject";
import type { IBitmapSaveObject } from "./IBitmapSaveObject";
import type { IVideoSaveObject } from "./IVideoSaveObject";
import type { ISoundSaveObject } from "./ISoundSaveObject";

export type IInstanceSaveObject = IMovieClipSaveObject
    | IFolderSaveObject
    | IBitmapSaveObject
    | IVideoSaveObject
    | ISoundSaveObject;