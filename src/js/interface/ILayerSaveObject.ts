import type { ILayerMode } from "./ILayerMode";
import type { ICharacterSaveObject } from "./ICharacterSaveObject";
import type { EmptyICharacterSaveObject } from "./EmptyICharacterSaveObject";

export interface ILayerSaveObject {
    id: number;
    name: string;
    color: string;
    lock: boolean;
    disable: boolean;
    light: boolean;
    mode: ILayerMode;
    characters: ICharacterSaveObject[];
    emptyCharacters: EmptyICharacterSaveObject[];
    parentId?: null | number;
    maskId?: null | number;
    guideId?: null | number;
}