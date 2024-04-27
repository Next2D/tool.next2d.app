import { execute } from "./StageSettingUpdateWidthService";
import { $STAGE_WIDTH_ID } from "../../../../config/StageSettingConfig";

describe("StageSettingUpdateWidthServiceTest", () =>
{
    test("execute test", () =>
    {
        const input = document.createElement("input");
        input.id = $STAGE_WIDTH_ID;
        document.body.appendChild(input);

        expect(input.value).toBe("");
        execute(100);
        expect(input.value).toBe("100");

        input.remove();
    });
});