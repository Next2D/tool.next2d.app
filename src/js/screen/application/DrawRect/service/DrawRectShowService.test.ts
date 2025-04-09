import { execute } from "./DrawRectShowService";
import { $SCREEN_DRAW_RECT_ID } from "../../../../config/ScreenConfig";
import { describe, expect, it } from "vitest";

describe("DrawRectShowServiceTest", () =>
{
    it("execute test", () =>
    {
        const parent = document.createElement("div");
        parent.id = $SCREEN_DRAW_RECT_ID;
        document.body.appendChild(parent);

        parent.style.display = "none";
        expect(parent.style.display).toBe("none");
        execute(0, 0);
        expect(parent.style.display).toBe("");

        parent.remove();
    });
});