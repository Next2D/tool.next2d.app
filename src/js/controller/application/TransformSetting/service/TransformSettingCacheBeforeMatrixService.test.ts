import { execute } from "./TransformSettingCacheBeforeMatrixService";
import { describe, expect, it, vi } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { Character } from "../../../../core/domain/model/Character";
import { transformSetting } from "../../../../controller/domain/model/TransformSetting";

describe("TransformSettingCacheBeforeMatrixService Test", () =>
{
    it("execute test", () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const movieClip = workSpace.scene;

        movieClip.selectedDepths.set(0, [0]);
        const layer = movieClip.getLayer(0);
        if (!layer) {
            throw new Error("Layer not found");
        }
        
        const character = new Character();
        character.startFrame = 0;
        character.endFrame = 10;
        layer.addCharacter(character);

        transformSetting.matrixs.length = 0;
        expect(transformSetting.matrixs.length).toBe(0);
        execute();
        expect(transformSetting.matrixs.length).toBe(1);
    });
});