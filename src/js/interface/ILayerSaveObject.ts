import type { ILayerMode } from "./ILayerMode";
import type { ICharacterSaveObject } from "./ICharacterSaveObject";
import type { IEmptyCharacterSaveObject } from "./IEmptyCharacterSaveObject";

export interface ILayerSaveObject {
    id: number;
    name: string;
    color: string;
    lock: boolean;
    disable: boolean;
    light: boolean;
    mode: ILayerMode;
    characters: ICharacterSaveObject[];
    emptyCharacters: IEmptyCharacterSaveObject[];
    parentId?: null | number;
    maskId?: null | number;
    guideId?: null | number;
}