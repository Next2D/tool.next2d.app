import { execute } from "./ShortcutSettingShowUseCase";
import { describe, expect, it } from "vitest";
import {
    $getTempMapping,
    $updateShortcutSetting,
    $useShortcutSetting
} from "../ShortcutSettingMenuUtil";

describe("ShortcutSettingShowUseCase Test", () =>
{
    it("execute test case1", () =>
    {
        const map = $getTempMapping();
        map.clear();
        map.set("test", { key: "test", name: "test", ctrl: false, shift: false, alt: false });

        $updateShortcutSetting(false);
        expect($useShortcutSetting()).toBe(false);
        expect(map.size).toBe(1);
        execute();
        expect($useShortcutSetting()).toBe(true);
        expect(map.size).toBe(0);
    });
});