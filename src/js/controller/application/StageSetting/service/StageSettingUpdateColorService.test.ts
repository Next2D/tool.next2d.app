import { execute } from "./StageSettingUpdateColorService";
import { $STAGE_BG_COLOR_ID } from "../../../../config/StageSettingConfig";
import { describe, expect, it } from "vitest";

describe("StageSettingUpdateColorServiceTest", () =>
{
    it("execute test", () =>
    {
        const input = document.createElement("input");
        input.id = $STAGE_BG_COLOR_ID;
        document.body.appendChild(input);

        expect(input.value).toBe("");
        execute("#990000");
        expect(input.value).toBe("#990000");

        input.remove();
    });
});