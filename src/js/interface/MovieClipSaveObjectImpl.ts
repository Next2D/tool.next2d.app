import type { LayerSaveObjectImpl } from "./LayerSaveObjectImpl";
import type { InstanceTypeImpl } from "./InstanceTypeImpl";
import type { LabelSaveObjectImpl } from "./LabelSaveObjectImpl";
import type { ActionSaveObjectImpl } from "./ActionSaveObjectImpl";
import type { SoundSaveObjectImpl } from "./SoundSaveObjectImpl";
import type { HistoryObjectImpl } from "./HistoryObjectImpl";

export interface MovieClipSaveObjectImpl
{
    id: number;
    name: string;
    type: InstanceTypeImpl;
    symbol: string;
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