import { execute } from "./ObjectSettingUpdateSymbolService";
import { $OBJECT_SETTING_SYMBOL_ID } from "../../../../config/ObjectSettingConfig";
import { describe, expect, it } from "vitest";

describe("ObjectSettingUpdateSymbolServiceTest", () =>
{
    it("execute test", async () =>
    {
        const input = document.createElement("input");
        input.id = $OBJECT_SETTING_SYMBOL_ID;
        document.body.appendChild(input);

        expect(input.value).toBe("");
        await execute("test");
        expect(input.value).toBe("test");

        input.remove();
    });
});