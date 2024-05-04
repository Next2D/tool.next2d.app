import { execute } from "./TransformSettingUpdateHeightElementService";
import { $TRANSFORM_OBJECT_HEIGHT_ID } from "../../../../config/TransformSettingConfig";

describe("TransformSettingUpdateHeightElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const input = document.createElement("input");
        input.id = $TRANSFORM_OBJECT_HEIGHT_ID;
        input.value = "0";
        document.body.appendChild(input);

        expect(input.value).toBe("0");
        execute(100);
        expect(input.value).toBe("100");

        input.remove();
    });
});