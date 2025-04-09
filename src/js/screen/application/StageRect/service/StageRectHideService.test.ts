import { execute } from "./StageRectHideService";
import { $SCREEN_STAGE_RECT_ID } from "../../../../config/ScreenConfig";
import { describe, expect, it } from "vitest";

describe("StageRectHideServiceTest", () =>
{
    it("execute test", () =>
    {
        const parent = document.createElement("div");
        parent.id = $SCREEN_STAGE_RECT_ID;
        document.body.appendChild(parent);

        expect(parent.style.display).toBe("");
        execute();
        expect(parent.style.display).toBe("none");

        parent.remove();
    });
});