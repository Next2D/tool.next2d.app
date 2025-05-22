import { execute } from "./TransformSettingRestoreBeforeMatrixService";
import { describe, expect, it, vi } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { Character } from "../../../../core/domain/model/Character";
import { transformSetting } from "../../../../controller/domain/model/TransformSetting";

describe("TransformSettingRestoreBeforeMatrixService Test", () =>
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

        character.x = 100;
        character.y = 200;
        character.scaleX = 1.2;
        character.scaleY = 1.5;

        // 初期化
        transformSetting.matrixs.length = 0;
        transformSetting.matrixs.push(new Float32Array([1, 0, 0, 1, 0, 0]));

        expect(character.x).toBe(100);
        expect(character.y).toBe(200);
        expect(character.scaleX).toBe(1.2);
        expect(character.scaleY).toBe(1.5);

        execute();

        expect(character.x).toBe(0);
        expect(character.y).toBe(0);
        expect(character.scaleX).toBe(1);
        expect(character.scaleY).toBe(1);
    });
});