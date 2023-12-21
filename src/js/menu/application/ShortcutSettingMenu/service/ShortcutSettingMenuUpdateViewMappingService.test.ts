import { execute } from "./ShortcutSettingMenuUpdateViewMappingService";
import {
    $getTempMapping,
    $getViewMapping
} from "../ShortcutSettingMenuUtil";
import { ShortcutViewObjectImpl } from "../../../../interface/ShortcutViewObjectImpl";

describe("ShortcutSettingMenuUpdateViewMappingServiceTest", () =>
{
    test("execute test", () =>
    {
        const tempMapping: Map<string, ShortcutViewObjectImpl> = $getTempMapping();
        const viewMapping: Map<string, ShortcutViewObjectImpl> = $getViewMapping();

        expect(tempMapping.size).toBe(0);

        tempMapping.set("default_global", {
            "customKey": "custom_global",
            "defaultKey": "default_global",
            "text": "global_text"
        });

        tempMapping.set("default_screen", {
            "customKey": "custom_screen",
            "defaultKey": "default_screen",
            "text": "screen_text"
        });

        expect(tempMapping.size).toBe(2);
        expect(viewMapping.size).toBe(0);

        execute();

        expect(tempMapping.size).toBe(0);
        expect(viewMapping.size).toBe(2);
        expect(viewMapping.has("default_global")).toBe(true);
        expect(viewMapping.has("default_screen")).toBe(true);
    });
});