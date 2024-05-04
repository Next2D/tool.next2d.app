import { execute } from "./TransformSettingUpdateRotationElementService";
import { $TRANSFORM_OBJECT_ROTATE_ID } from "../../../../config/TransformSettingConfig";

describe("TransformSettingUpdateRotationElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const input = document.createElement("input");
        input.id = $TRANSFORM_OBJECT_ROTATE_ID;
        input.value = "0";
        document.body.appendChild(input);

        expect(input.value).toBe("0");
        execute(100);
        expect(input.value).toBe("100");

        input.remove();
    });
});