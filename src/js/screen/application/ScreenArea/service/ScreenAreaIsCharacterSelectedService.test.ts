import { execute } from "./ScreenAreaIsCharacterSelectedService";
import { describe, expect, it } from "vitest";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";
import { Character } from "../../../../core/domain/model/Character";
import { WorkSpace } from "../../../../core/domain/model/WorkSpace";

describe("ScreenAreaIsCharacterSelectedService Test", () =>
{
    it("execute test case1", () =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const movieClip = workSpace.scene;
        const layer = movieClip.layers[0];
        const character = new Character();

        expect(execute(movieClip, layer, character)).toBe(false);
    });

    it("execute test case2", () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const movieClip = workSpace.scene;
        movieClip.selectedDepths.clear();
        
        const layer = movieClip.layers[0];
        movieClip.selectedDepths.set(0, [0]);
        const character = new Character();
        character.depth = 0;

        expect(execute(movieClip, layer, character)).toBe(true);
    });
});