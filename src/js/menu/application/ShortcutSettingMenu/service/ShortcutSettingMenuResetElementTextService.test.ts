import { ShortcutViewObjectImpl } from "../../../../interface/ShortcutViewObjectImpl";
import { $getTempMapping, $getViewMapping } from "../ShortcutSettingMenuUtil";
import { execute } from "./ShortcutSettingMenuResetElementTextService";

describe("ShortcutSettingMenuResetElementTextServiceTest", () =>
{
    test("execute test", () =>
    {
        // mock
        const tempMapping: Map<string, ShortcutViewObjectImpl> = $getTempMapping();
        const viewMapping: Map<string, ShortcutViewObjectImpl> = $getViewMapping();

        tempMapping.set("default_screen", {
            "customKey": "custom_screen",
            "defaultKey": "default_screen",
            "text": "test_screen_text"
        });

        viewMapping.set("default_tool", {
            "customKey": "custom_tool",
            "defaultKey": "default_tool",
            "text": "test_tool_text"
        });

        const div1 = document.createElement("div");
        document.body.appendChild(div1);

        div1.id = "shortcut-default_screen";
        div1.dataset.defaultText = "default_screen";
        div1.textContent = "test_screen_text";
        expect(div1.textContent).toBe("test_screen_text");

        const div2 = document.createElement("div");
        document.body.appendChild(div2);

        div2.id = "shortcut-default_tool";
        div2.dataset.defaultText = "default_tool";
        div2.textContent = "test_tool_text";
        expect(div2.textContent).toBe("test_tool_text");

        execute();
        expect(div1.textContent).toBe("default_screen");
        expect(div2.textContent).toBe("default_tool");

        div1.remove();
        div2.remove();
    });
});