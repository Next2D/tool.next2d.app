import type { LayerModeImpl } from "./LayerModeImpl";
import type { ICharacterSaveObject } from "./ICharacterSaveObject";
import type { EmptyICharacterSaveObject } from "./EmptyICharacterSaveObject";

export interface LayerSaveObjectImpl {
    id: number;
    name: string;
    color: string;
    lock: boolean;
    disable: boolean;
    light: boolean;
    mode: LayerModeImpl;
    characters: ICharacterSaveObject[];
    emptyCharacters: EmptyICharacterSaveObject[];
    parentId?: null | number;
    maskId?: null | number;
    guideId?: null | number;
}