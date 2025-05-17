import { execute } from "./ScreenAreaRemoveDisplayObjectElementUseCase";
import { $SCREEN_STAGE_AREA_ID } from "../../../../config/ScreenConfig";
import { Character } from "../../../../core/domain/model/Character";
import { describe, expect, it } from "vitest";

describe("ScreenAreaRemoveDisplayObjectElementUseCase Test", () =>
{
    it("execute test", () =>
    {
        const parent = document.createElement("div");
        parent.id = $SCREEN_STAGE_AREA_ID;
        document.body.appendChild(parent);

        for (let idx = 0; idx < 10; ++idx) {
            const div = document.createElement("div");
            parent.appendChild(div);
            div.classList.add(`layer-id-${idx}`);
        }

        const character = new Character();
        character.depth = 0;

        expect(parent.children.length).toBe(10);
        execute(2, character.depth);
        expect(parent.children.length).toBe(9);

        parent.remove();
    });
});