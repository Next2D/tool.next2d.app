import { execute } from "./ScreenStageAreaAllDisplayObjectActiveService";
import { $SCREEN_STAGE_AREA_ID } from "../../../../config/ScreenConfig";
import { describe, expect, it } from "vitest";

describe("ScreenStageAreaAllDisplayObjectActiveServiceTest", () =>
{
    it("execute test", () =>
    {
        const parent = document.createElement("div");
        parent.id = $SCREEN_STAGE_AREA_ID;
        document.body.appendChild(parent);

        const div = document.createElement("div");
        div.style.pointerEvents = "none";
        parent.appendChild(div);

        expect(div.style.pointerEvents).toBe("none");
        execute();
        expect(div.style.pointerEvents).toBe("");

        parent.remove();
    });
});