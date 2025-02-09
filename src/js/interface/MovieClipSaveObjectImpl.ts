import type { LayerSaveObjectImpl } from "./LayerSaveObjectImpl";
import type { LabelSaveObjectImpl } from "./LabelSaveObjectImpl";
import type { IActionSaveObject } from "./IActionSaveObject";
import type { MovieClipSoundSaveObjectImpl } from "./MovieClipSoundSaveObjectImpl";
import type { InstanceObjectImpl } from "./InstanceObjectImpl";

export interface MovieClipSaveObjectImpl extends InstanceObjectImpl
{
    folderId?: number;
    currentFrame?: number;
    leftFrame?: number;
    layers?: LayerSaveObjectImpl[];
    labels?: LabelSaveObjectImpl[];
    sounds?: MovieClipSoundSaveObjectImpl[];
    actions?: IActionSaveObject[];
    scrollX?: number;
    scrollY?: number;
}