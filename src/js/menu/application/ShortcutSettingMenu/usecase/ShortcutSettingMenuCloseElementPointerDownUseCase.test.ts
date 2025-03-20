import { execute } from "./ShortcutSettingMenuCloseElementPointerDownUseCase";
import { describe, expect, it, vi } from "vitest";

describe("ShortcutSettingMenuCloseElementPointerDownUseCase Test", () =>
{
    it("execute test", () =>
    {
        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "preventDefault": vi.fn(() => preventDefault = true),
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);

        execute(mockEvent);

        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
    });
});