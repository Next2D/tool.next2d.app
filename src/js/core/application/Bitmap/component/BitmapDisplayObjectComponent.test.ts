import { execute } from "./BitmapDisplayObjectComponent";
import { describe, expect, it } from "vitest";
import { Character } from "../../../../core/domain/model/Character";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { Bitmap } from "../../../../core/domain/model/Bitmap";

describe("BitmapDisplayObjectComponent Test", () =>
{
    it("test case", () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const bitmap = new Bitmap({
            "imageType": "png",
            "id": 1,
            "type": "bitmap",
            "name": "Bitmap_2",
            "width": 100,
            "height": 120
        });
        workSpace.libraries.set(bitmap.id, bitmap);

        const character = new Character();
        character.libraryId = bitmap.id;

        expect(execute(character, 1))
            .toBe(`<div class="display-object layer-id-1" data-depth="0" data-layer-id="1" style="left: 0px; top: 0px; width: 100px; height: 120px; --transform: matrix(1, 0, 0, 1, 0, 0); --width: 100px; --height: 120px;"><div class="canvas-container container-layer-id-1"></div></div>`);
        
        workSpace.libraries.delete(bitmap.id);
    });
});