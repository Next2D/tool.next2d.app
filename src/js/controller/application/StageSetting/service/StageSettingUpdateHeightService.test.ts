import { execute } from "./StageSettingUpdateHeightService";
import { $STAGE_HEIGHT_ID } from "../../../../config/StageSettingConfig";

describe("StageSettingUpdateHeightServiceTest", () =>
{
    test("execute test", () =>
    {
        const input = document.createElement("input");
        input.id = $STAGE_HEIGHT_ID;
        document.body.appendChild(input);

        expect(input.value).toBe("");
        execute(100);
        expect(input.value).toBe("100");

        input.remove();
    });
});