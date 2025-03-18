import { execute } from "./ShortcutSettingMenuChangeListStyleUseCase";
import { describe, expect, it, vi } from "vitest";

describe("ShortcutSettingMenuChangeListStyleUseCase Test", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");

        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "button": 0,
            "target": div,
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "preventDefault": vi.fn(() => preventDefault = true)
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect(div.classList.contains("shortcut-active")).toBe(false);

        execute(mockEvent);

        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect(div.classList.contains("shortcut-active")).toBe(true);
    });
});