import type { ILayerSaveObject } from "./ILayerSaveObject";
import type { ILabelSaveObject } from "./ILabelSaveObject";
import type { IActionSaveObject } from "./IActionSaveObject";
import type { IMovieClipSoundSaveObject } from "./IMovieClipSoundSaveObject";
import type { IInstanceObject } from "./IInstanceObject";

export interface IMovieClipSaveObject extends IInstanceObject
{
    folderId?: number;
    currentFrame?: number;
    layers?: ILayerSaveObject[];
    labels?: ILabelSaveObject[];
    sounds?: IMovieClipSoundSaveObject[];
    actions?: IActionSaveObject[];
    scrollX?: number;
    scrollY?: number;
}