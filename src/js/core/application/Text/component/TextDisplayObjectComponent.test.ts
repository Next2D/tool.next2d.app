import { execute } from "./TextDisplayObjectComponent";
import { describe, expect, it } from "vitest";
import { Character } from "../../../../core/domain/model/Character";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { Text } from "../../../../core/domain/model/Text";

describe("TextDisplayObjectComponent Test", () =>
{
    it("test case", () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const text = new Text({
            "id": 1,
            "type": "text",
            "name": "Text_1"
        });
        workSpace.libraries.set(text.id, text);

        const character = new Character();
        character.libraryId = text.id;

        expect(execute(character, 1))
            .toBe(`<div class="display-object layer-id-1" data-depth="0" data-layer-id="1" style="left: 0px; top: 0px; width: 0px; height: 0px;"><div class="canvas-container container-layer-id-1" style="width: 0px; height: 0px; transform: matrix(1, 0, 0, 1, 0, 0);"></div></div>`);
    });
});