import type { IActionSaveObject } from "./IActionSaveObject";
import type { ICharacterPublishObject } from "./ICharacterPublishObject";
import type { IControllerPublishObject } from "./IControllerPublishObject";
import type { ILabelSaveObject } from "./ILabelSaveObject";
import type { IPlaceObject } from "./IPlaceObject";
import type { IPlaceObjectMap } from "./IPlaceObjectMap";
import type { ISoundPublishObject } from "./ISoundPublishObject";

export interface IMovieClipPublishJson
{
    symbol?: string;
    extends: string;
    totalFrame: number;
    dictionary: ICharacterPublishObject[];
    controller: IControllerPublishObject;
    placeObjects: IPlaceObject[];
    placeMap: IPlaceObjectMap;
    actions?: IActionSaveObject[];
    sounds?: ISoundPublishObject[];
    labels?: ILabelSaveObject[];
}