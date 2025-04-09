import { execute } from "./StageRectShowService";
import { $SCREEN_STAGE_RECT_ID } from "../../../../config/ScreenConfig";
import { describe, expect, it } from "vitest";

describe("StageRectShowServiceTest", () =>
{
    it("execute test", () =>
    {
        const parent = document.createElement("div");
        parent.id = $SCREEN_STAGE_RECT_ID;
        document.body.appendChild(parent);

        parent.style.display = "none";
        expect(parent.style.display).toBe("none");
        execute();
        expect(parent.style.display).toBe("");

        parent.remove();
    });
});