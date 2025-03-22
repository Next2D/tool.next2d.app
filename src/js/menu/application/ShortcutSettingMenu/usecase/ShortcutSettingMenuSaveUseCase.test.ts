import { execute } from "./ShortcutSettingMenuSaveUseCase";
import { describe, expect, it, vi } from "vitest";
import { $USER_SHORTCUT_SETTING_KEY } from "../../../../config/Config";

describe("ShortcutSettingMenuSaveUseCase Test", () =>
{
    it("execute test", () =>
    {
        localStorage.removeItem($USER_SHORTCUT_SETTING_KEY);

        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "button": 0,
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "preventDefault": vi.fn(() => preventDefault = true),
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect(localStorage.getItem($USER_SHORTCUT_SETTING_KEY)).toBe(null);

        execute(mockEvent);
        
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect(localStorage.getItem($USER_SHORTCUT_SETTING_KEY)).not.toBe(null);
    });
});