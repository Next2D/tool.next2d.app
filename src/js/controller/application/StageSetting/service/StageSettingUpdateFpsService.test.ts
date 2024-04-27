import { execute } from "./StageSettingUpdateFpsService";
import { $STAGE_FPS_ID } from "../../../../config/StageSettingConfig";

describe("StageSettingUpdateFpsServiceTest", () =>
{
    test("execute test", () =>
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