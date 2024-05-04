import { execute } from "./TransformSettingUpdateXElementService";
import { $TRANSFORM_OBJECT_X_ID } from "../../../../config/TransformSettingConfig";

describe("TransformSettingUpdateXElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const input = document.createElement("input");
        input.id = $TRANSFORM_OBJECT_X_ID;
        input.value = "0";
        document.body.appendChild(input);

        expect(input.value).toBe("0");
        execute(100);
        expect(input.value).toBe("100");

        input.remove();
    });
});