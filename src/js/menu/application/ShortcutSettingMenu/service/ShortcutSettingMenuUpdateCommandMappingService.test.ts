import { ShortcutViewObjectImpl } from "../../../../interface/ShortcutViewObjectImpl";
import { $clearCommandMapping, $clearViewMapping, $getCommandMapping, $getViewMapping } from "../ShortcutSettingMenuUtil";
import { execute } from "./ShortcutSettingMenuUpdateCommandMappingService";

describe("ShortcutSettingMenuUpdateCommandMappingServiceTest", () =>
{
    test("execute test", () =>
    {
        // mock
        const viewMapping: Map<string, ShortcutViewObjectImpl> = $getViewMapping();

        viewMapping.set("default_global", {
            "customKey": "custom_global",
            "defaultKey": "default_global",
            "text": "global_text"
        });

        viewMapping.set("default_screen", {
            "customKey": "custom_screen",
            "defaultKey": "default_screen",
            "text": "screen_text"
        });

        const commandMapping: Map<string, string> = $getCommandMapping();
        expect(commandMapping.size).toBe(0);

        execute();

        expect(commandMapping.size).toBe(2);
        expect(commandMapping.get("custom_global")).toBe("default_global");

        expect(commandMapping.size).toBe(2);
        expect(commandMapping.get("custom_screen")).toBe("default_screen");

        // テスト終了したので初期化
        $clearViewMapping();
        $clearCommandMapping();
    });
});