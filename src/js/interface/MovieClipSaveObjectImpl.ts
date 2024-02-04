import type { LayerSaveObjectImpl } from "./LayerSaveObjectImpl";
import type { LabelSaveObjectImpl } from "./LabelSaveObjectImpl";
import type { ActionSaveObjectImpl } from "./ActionSaveObjectImpl";
import type { SoundSaveObjectImpl } from "./SoundSaveObjectImpl";
import type { HistoryObjectImpl } from "./HistoryObjectImpl";
import type { InstanceObjectImpl } from "./InstanceObjectImpl";

export interface MovieClipSaveObjectImpl extends InstanceObjectImpl
{
    folderId?: number;
    currentFrame?: number;
    leftFrame?: number;
    layers?: LayerSaveObjectImpl[];
    labels?: LabelSaveObjectImpl[];
    sounds?: SoundSaveObjectImpl[];
    actions?: ActionSaveObjectImpl[];
    scrollX?: number;
    scrollY?: number;
    histories?: HistoryObjectImpl[];
    historyIndex?: number;
}