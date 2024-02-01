import { execute } from "./ObjectSettingUpdateNameService";
import { $OBJECT_SETTING_NAME_ID } from "../../../../../../config/ObjectSettingConfig";

describe("ObjectSettingUpdateNameServiceTest", () =>
{
    test("execute test", async () =>
    {
        const input = document.createElement("input");
        input.id = $OBJECT_SETTING_NAME_ID;
        document.body.appendChild(input);

        expect(input.value).toBe("");
        await execute("test");
        expect(input.value).toBe("test");

        input.remove();
    });
});