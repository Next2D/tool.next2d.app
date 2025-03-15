import { execute } from "./TextDisplayObjectComponent";
import { describe, expect, it } from "vitest";
import { Character } from "../../../../core/domain/model/Character";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";

describe("TextDisplayObjectComponent Test", () =>
{
    it("test case", () =>
    {

        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const character = new Character();
        expect(execute(character, 1))
            .toBe(`<div class="display-object text-field layer-id-1" data-depth="1" data-layer-id="1" style="left: 0px; top: 0px; opacity: 1; "></div>`);
    });
});