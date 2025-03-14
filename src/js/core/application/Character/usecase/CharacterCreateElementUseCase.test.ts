import { execute } from "./CharacterCreateElementUseCase";
import { describe, expect, it } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { Bitmap } from "../../../../core/domain/model/Bitmap";
import { Layer } from "../../../../core/domain/model/Layer";
import { Character } from "../../../../core/domain/model/Character";


describe("CharacterCreateElementUseCase Test", () =>
{
    it("test case", async () =>
    {
        const bitmap = new Bitmap({
            "type": "bitmap",
            "id": 1,
            "width": 200,
            "height": 120,
            "buffer": new Uint8Array([1,0,0,1])
        });

        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        workSpace.libraries.set(1, bitmap as Bitmap);

        const character = new Character();
        character.libraryId = 1;

        const layer = new Layer();
        layer.lock = true;
        const parent = document.createElement("div");

        expect(parent.children.length).toBe(0);
        
        const div = await execute(character, parent, layer);
        if (!div) {
            throw new Error("div is null");
        }

        expect(parent.children.length).toBe(1);
        expect(div.classList.contains("disabled")).toBe(true);
    });
});