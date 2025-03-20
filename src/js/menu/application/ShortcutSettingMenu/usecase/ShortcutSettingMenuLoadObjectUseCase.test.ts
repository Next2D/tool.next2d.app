import { execute } from "./ShortcutSettingMenuLoadObjectUseCase";
import { $USER_SHORTCUT_SETTING_KEY } from "../../../../config/Config";
import { describe, expect, it, vi } from "vitest";
import {
    $clearCommandMapping,
    $clearTempMapping,
    $clearViewMapping,
    $getCommandMapping,
    $getViewMapping
} from "../ShortcutSettingMenuUtil";

describe("ShortcutSettingMenuLoadObjectUseCase Test", () =>
{
    it("execute test case1", () =>
    {
        localStorage.setItem($USER_SHORTCUT_SETTING_KEY, JSON.stringify([{
            "defaultKey": "defaultKey",
            "customKey": "customKey",
            "text": "text"
        }]));

        const commandMapping = $getCommandMapping();
        const viewMapping = $getViewMapping();

        expect(commandMapping.size).toBe(0);
        expect(viewMapping.size).toBe(0);
        execute();
        expect(commandMapping.size).toBe(1);
        expect(viewMapping.size).toBe(1);
        expect(viewMapping.has("defaultKey")).toBe(true);
        expect(commandMapping.has("customKey")).toBe(true);
    });
});