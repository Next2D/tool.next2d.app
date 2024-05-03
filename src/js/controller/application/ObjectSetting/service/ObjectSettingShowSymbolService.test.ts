import { execute } from "./ObjectSettingShowSymbolService";
import { $OBJECT_SETTING_SYMBOL_AREA_ID } from "../../../../config/ObjectSettingConfig";

describe("ObjectSettingShowSymbolServiceTest", () =>
{
    test("execute test", async () =>
    {
        const div = document.createElement("div");
        div.id = $OBJECT_SETTING_SYMBOL_AREA_ID;
        div.style.display = "none";
        document.body.appendChild(div);

        expect(div.style.display).toBe("none");
        await execute();
        expect(div.style.display).toBe("");

        div.remove();
    });
});