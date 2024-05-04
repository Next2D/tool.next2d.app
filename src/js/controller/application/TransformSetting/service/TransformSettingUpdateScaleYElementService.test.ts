import { execute } from "./TransformSettingUpdateScaleYElementService";
import { $TRANSFORM_OBJECT_SCALE_Y_ID } from "../../../../config/TransformSettingConfig";

describe("TransformSettingUpdateScaleYElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const input = document.createElement("input");
        input.id = $TRANSFORM_OBJECT_SCALE_Y_ID;
        input.value = "0";
        document.body.appendChild(input);

        expect(input.value).toBe("0");
        execute(100);
        expect(input.value).toBe("100");

        input.remove();
    });
});