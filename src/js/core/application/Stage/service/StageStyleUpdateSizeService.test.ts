import { execute } from "./StageStyleUpdateSizeService";
import { $SCREEN_STAGE_ID } from "../../../../config/ScreenConfig";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";
import { describe, expect, it } from "vitest";

describe("StageStyleUpdateSizeServiceTest", () =>
{
    it("execute test", () =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();

        const div = document.createElement("div");
        div.id = $SCREEN_STAGE_ID;
        document.body.appendChild(div);

        expect(div.style.width).toBe("");
        expect(div.style.height).toBe("");

        execute(500, 400);

        expect(div.style.width).toBe("500px");
        expect(div.style.height).toBe("400px");

        workSpace.scale = 1.5;
        execute(500, 400);

        expect(div.style.width).toBe("750px");
        expect(div.style.height).toBe("600px");

        div.remove();
    });
});