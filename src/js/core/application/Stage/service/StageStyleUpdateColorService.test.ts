import { execute } from "./StageStyleUpdateColorService";
import { $SCREEN_STAGE_ID } from "../../../../config/ScreenConfig";
import { describe, expect, it } from "vitest";

describe("StageStyleUpdateColorServiceTest", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = $SCREEN_STAGE_ID;
        document.body.appendChild(div);

        expect(div.style.backgroundColor).toBe("");

        execute("#ff00ff");

        expect(div.style.backgroundColor).toBe("rgb(255, 0, 255)");

        div.remove();
    });
});