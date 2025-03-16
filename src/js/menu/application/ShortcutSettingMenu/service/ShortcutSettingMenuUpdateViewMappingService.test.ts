import { execute } from "./ShortcutSettingMenuUpdateViewMappingService";
import {
    $getTempMapping,
    $getViewMapping
} from "../ShortcutSettingMenuUtil";
import { IShortcutViewObject } from "../../../../interface/IShortcutViewObject";
import { describe, expect, it } from "vitest";

describe("ShortcutSettingMenuUpdateViewMappingServiceTest", () =>
{
    it("execute test", () =>
    {
        const tempMapping: Map<string, IShortcutViewObject> = $getTempMapping();
        const viewMapping: Map<string, IShortcutViewObject> = $getViewMapping();

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