import { execute } from "./ShapeDisplayObjectComponent";
import { describe, expect, it } from "vitest";
import { Character } from "../../../../core/domain/model/Character";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { Shape } from "../../../../core/domain/model/Shape";

describe("ShapeDisplayObjectComponent Test", () =>
{
    it("test case", () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const shape = new Shape({
            "id": 1,
            "type": "shape",
            "name": "Shape_1",
            "bounds": {
                "xMin": 0,
                "yMin": 0,
                "xMax": 100,
                "yMax": 120
            }
        });
        workSpace.libraries.set(shape.id, shape);

        const character = new Character();
        character.libraryId = shape.id;
        expect(execute(character, 1))
            .toBe(`<div class="display-object layer-id-1" data-depth="0" data-layer-id="1" style="left: 0px; top: 0px; width: 100px; height: 120px;"><div class="canvas-container container-layer-id-1" style="width: 100px; height: 120px; transform: matrix(1, 0, 0, 1, 0, 0);"></div></div>`);
    });
});