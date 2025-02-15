import { execute } from "./StageSettingUpdateFpsService";
import { $STAGE_FPS_ID } from "../../../../config/StageSettingConfig";
import { describe, expect, it } from "vitest";

describe("StageSettingUpdateFpsServiceTest", () =>
{
    it("execute test", () =>
    {
        const input = document.createElement("input");
        input.id = $STAGE_FPS_ID;
        document.body.appendChild(input);

        expect(input.value).toBe("");
        execute(60);
        expect(input.value).toBe("60");

        input.remove();
    });
});