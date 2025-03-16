import { IShortcutViewObject } from "../../../../interface/IShortcutViewObject";
import { $getViewMapping } from "../ShortcutSettingMenuUtil";
import { execute } from "./ShortcutSettingMenuUpdateElementTextService";
import { describe, expect, it } from "vitest";

describe("ShortcutSettingMenuUpdateElementTextServiceTest", () =>
{
    it("execute test", () =>
    {
        // mock
        const viewMapping: Map<string, IShortcutViewObject> = $getViewMapping();

        viewMapping.set("default_screen", {
            "customKey": "custom_screen",
            "defaultKey": "default_screen",
            "text": "test_text"
        });

        const div = document.createElement("div");
        div.id = "shortcut-default_screen";
        document.body.appendChild(div);

        div.textContent = "test";
        expect(div.textContent).toBe("test");

        execute();
        expect(div.textContent).toBe("test_text");

        div.remove();
    });
});