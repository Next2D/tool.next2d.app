import { execute } from "./ScreenAreaRemoveAllDisplayObjectService";
import { $SCREEN_STAGE_AREA_ID } from "../../../../config/ScreenConfig";
import { describe, expect, it } from "vitest";

describe("ScreenAreaRemoveAllDisplayObjectServiceTest", () =>
{
    it("execute test", () =>
    {
        const parent = document.createElement("div");
        parent.id = $SCREEN_STAGE_AREA_ID;
        document.body.appendChild(parent);

        const classes = [
            "abc",
            "display-object",
            "display-object",
            "display-object",
            "test",
            "display-object",
            "display-object",
            "display-object",
            "display-object",
            "zzz"
        ];
        for (let idx = 0; idx < 10; ++idx) {
            const div = document.createElement("div");
            parent.appendChild(div);
            div.classList.add(classes[idx]);
        }

        expect(parent.children.length).toBe(10);
        execute();
        expect(parent.children.length).toBe(3);

        parent.remove();
    });
});