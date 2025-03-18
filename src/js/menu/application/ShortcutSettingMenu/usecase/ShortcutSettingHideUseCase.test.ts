import { execute } from "./ShortcutSettingHideUseCase";
import { describe, expect, it } from "vitest";
import {
    $updateShortcutSetting,
    $useShortcutSetting,
    $getTempMapping
} from "../ShortcutSettingMenuUtil";

describe("ShortcutSettingHideUseCase Test", () =>
{
    it("execute test", () =>
    {
        const map = $getTempMapping();
        map.set("test", { key: "test", value: "test" });
        expect(map.size).toBe(1);

        $updateShortcutSetting(true);
        expect($useShortcutSetting()).toBe(true);
        
        execute();

        expect($useShortcutSetting()).toBe(false);
        expect(map.size).toBe(0);
    });
});