import { ShortcutKeyStringImpl } from "../../../../interface/ShortcutKeyStringImpl";
import { ShortcutViewObjectImpl } from "../../../../interface/ShortcutViewObjectImpl";
import { $clearTempMapping, $getTempMapping } from "../ShortcutSettingMenuUtil";
import { execute } from "./ShortcutSettingMenuUpdateElementTextService";

describe("ShortcutSettingMenuUpdateElementTextServiceTest", () =>
{
    test("execute test", () =>
    {
        // mock
        const tempMapping: Map<ShortcutKeyStringImpl, Map<string, ShortcutViewObjectImpl>> = $getTempMapping();
        const screenMap: Map<string, ShortcutViewObjectImpl> | undefined = tempMapping.get("screen");
        if (!screenMap) {
            throw new Error("not found screenMap");
        }

        screenMap.set("default_screen", {
            "customKey": "custom_screen",
            "defaultKey": "default_screen",
            "text": "screen_text"
        });

        const screen = document.createElement("div");
        screen.id = "shortcut-list-screen";
        document.body.appendChild(screen);

        const div = document.createElement("div");
        screen.appendChild(div);
        const command = document.createElement("div");
        div.appendChild(command);

        command.setAttribute("class", "command");
        command.dataset.defaultKey = "default_screen";
        command.textContent = "test";
        expect(command.textContent).toBe("test");

        execute();
        expect(command.textContent).toBe("screen_text");

        // テスト終了したので初期化
        $clearTempMapping();

        screen.remove();
    });
});