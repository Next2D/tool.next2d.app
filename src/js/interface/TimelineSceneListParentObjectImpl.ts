import { Character } from "@/core/domain/model/Character";

export interface TimelineSceneListParentObjectImpl {
    parentLibraryId: number;
    selectCharacter: Character | null;
}