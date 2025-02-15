import { execute } from "./ObjectSettingHideSymbolService";
import { $OBJECT_SETTING_SYMBOL_AREA_ID } from "../../../../config/ObjectSettingConfig";
import { describe, expect, it } from "vitest";

describe("ObjectSettingHideSymbolServiceTest", () =>
{
    it("execute test", async () =>
    {
        const div = document.createElement("div");
        div.id = $OBJECT_SETTING_SYMBOL_AREA_ID;
        div.style.display = "";
        document.body.appendChild(div);

        expect(div.style.display).toBe("");
        await execute();
        expect(div.style.display).toBe("none");

        div.remove();
    });
});