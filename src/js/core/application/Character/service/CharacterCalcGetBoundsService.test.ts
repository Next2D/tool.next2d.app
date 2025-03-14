import { execute } from "./CharacterCalcGetBoundsService";
import { describe, expect, it } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { Bitmap } from "../../../../core/domain/model/Bitmap";


describe("CharacterCalcGetBoundsService Test", () =>
{
    it("test case", () =>
    {
        const bitmap = new Bitmap({
            "width": 200,
            "height": 120,
            "buffer": new Uint8Array([1,0,0,1])
        });

        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        workSpace.libraries.set(1, bitmap as Bitmap);

        const bounds = execute(1, [1.2, 0.3, -0.5, 1.2, 10, 20], 1);

        expect(bounds.xMin).toBe(-50);
        expect(bounds.yMin).toBe(20);
        expect(bounds.xMax).toBe(250);
        expect(bounds.yMax).toBe(224);

        workSpace.libraries.delete(1);
    });
});