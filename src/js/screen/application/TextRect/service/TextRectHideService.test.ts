import { execute } from "./TextRectHideService";
import { $SCREEN_DRAW_TEXT_ID } from "../../../../config/ScreenConfig";
import { describe, expect, it } from "vitest";

describe("TextRectHideServiceTest", () =>
{
    it("execute test", () =>
    {
        const parent = document.createElement("div");
        parent.id = $SCREEN_DRAW_TEXT_ID;
        document.body.appendChild(parent);

        expect(parent.style.display).toBe("");
        execute();
        expect(parent.style.display).toBe("none");

        parent.remove();
    });
});