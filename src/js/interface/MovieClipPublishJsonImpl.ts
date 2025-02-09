import type { IActionSaveObject } from "./IActionSaveObject";
import type { ICharacterPublishObject } from "./ICharacterPublishObject";
import type { IControllerPublishObject } from "./IControllerPublishObject";
import type { LabelSaveObjectImpl } from "./LabelSaveObjectImpl";
import type { PlaceObjectImpl } from "./PlaceObjectImpl";
import type { PlaceObjectMapImpl } from "./PlaceObjectMapImpl";
import type { SoundPublishObjectImpl } from "./SoundPublishObjectImpl";

export interface MovieClipPublishJsonImpl
{
    symbol?: string;
    extends: string;
    totalFrame: number;
    dictionary: ICharacterPublishObject[];
    controller: IControllerPublishObject;
    placeObjects: PlaceObjectImpl[];
    placeMap: PlaceObjectMapImpl;
    actions?: IActionSaveObject[];
    sounds?: SoundPublishObjectImpl[];
    labels?: LabelSaveObjectImpl[];
}