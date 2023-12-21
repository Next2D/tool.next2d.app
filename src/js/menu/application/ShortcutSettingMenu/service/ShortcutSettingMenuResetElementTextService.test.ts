import { ShortcutViewObjectImpl } from "../../../../interface/ShortcutViewObjectImpl";
import { $getTempMapping } from "../ShortcutSettingMenuUtil";
import { execute } from "./ShortcutSettingMenuResetElementTextService";

describe("ShortcutSettingMenuResetElementTextServiceTest", () =>
{
    test("execute test", () =>
    {
        // mock
        const tempMapping: Map<string, ShortcutViewObjectImpl> = $getTempMapping();

        tempMapping.set("default_screen", {
            "customKey": "custom_screen",
            "defaultKey": "default_screen",
            "text": "test_text"
        });

        const div = document.createElement("div");
        div.id = "shortcut-default_screen";
        div.dataset.defaultText = "default_screen";
        document.body.appendChild(div);

        div.textContent = "test_text";
        expect(div.textContent).toBe("test_text");

        execute();
        expect(div.textContent).toBe("default_screen");

        div.remove();
    });
});