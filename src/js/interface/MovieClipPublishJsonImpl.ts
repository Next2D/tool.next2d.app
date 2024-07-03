import type { ActionSaveObjectImpl } from "./ActionSaveObjectImpl";
import type { CharacterPublishObjectImpl } from "./CharacterPublishObjectImpl";
import type { ControllerPublishObjectImpl } from "./ControllerPublishObjectImpl";
import type { LabelSaveObjectImpl } from "./LabelSaveObjectImpl";
import type { PlaceObjectImpl } from "./PlaceObjectImpl";
import type { PlaceObjectMapImpl } from "./PlaceObjectMapImpl";
import type { SoundPublishObjectImpl } from "./SoundPublishObjectImpl";

export interface MovieClipPublishJsonImpl
{
    symbol?: string;
    extends: string;
    totalFrame: number;
    dictionary: CharacterPublishObjectImpl[];
    controller: ControllerPublishObjectImpl;
    placeObjects: PlaceObjectImpl[];
    placeMap: PlaceObjectMapImpl;
    actions?: ActionSaveObjectImpl[];
    sounds?: SoundPublishObjectImpl[];
    labels?: LabelSaveObjectImpl[];
}