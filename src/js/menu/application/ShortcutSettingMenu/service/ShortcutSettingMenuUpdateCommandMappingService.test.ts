import { ShortcutKeyStringImpl } from "../../../../interface/ShortcutKeyStringImpl";
import { ShortcutViewObjectImpl } from "../../../../interface/ShortcutViewObjectImpl";
import { $clearCommandMapping, $clearTempMapping, $getCommandMapping, $getTempMapping } from "../ShortcutSettingMenuUtil";
import { execute } from "./ShortcutSettingMenuUpdateCommandMappingService";

describe("ShortcutSettingMenuUpdateCommandMappingServiceTest", () =>
{
    test("execute test", () =>
    {
        // mock
        const tempMapping: Map<ShortcutKeyStringImpl, Map<string, ShortcutViewObjectImpl>> = $getTempMapping();
        const globalMap: Map<string, ShortcutViewObjectImpl> | undefined = tempMapping.get("global");
        if (!globalMap) {
            throw new Error("not found globalMap");
        }

        globalMap.set("default_global", {
            "customKey": "custom_global",
            "defaultKey": "default_global",
            "text": "global_text"
        });

        const screenMap: Map<string, ShortcutViewObjectImpl> | undefined = tempMapping.get("screen");
        if (!screenMap) {
            throw new Error("not found screenMap");
        }

        screenMap.set("default_screen", {
            "customKey": "custom_screen",
            "defaultKey": "default_screen",
            "text": "screen_text"
        });

        execute();

        const commandMapping: Map<ShortcutKeyStringImpl, Map<string, string>> = $getCommandMapping();
        const globalCommandMap: Map<string, string> | undefined = commandMapping.get("global");
        if (!globalCommandMap) {
            throw new Error("not found globalCommandMap");
        }
        expect(globalCommandMap.size).toBe(1);
        expect(globalCommandMap.get("custom_global")).toBe("default_global");

        const screenCommandMap: Map<string, string> | undefined = commandMapping.get("screen");
        if (!screenCommandMap) {
            throw new Error("not found screenCommandMap");
        }
        expect(screenCommandMap.size).toBe(1);
        expect(screenCommandMap.get("custom_screen")).toBe("default_screen");

        // テスト終了したので初期化
        $clearTempMapping();
        $clearCommandMapping();
    });
});