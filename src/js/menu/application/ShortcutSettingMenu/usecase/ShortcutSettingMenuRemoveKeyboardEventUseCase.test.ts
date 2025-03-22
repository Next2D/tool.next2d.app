import { execute } from "./ShortcutSettingMenuRemoveKeyboardEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { EventType } from "../../../../tool/domain/event/EventType";

describe("ShortcutSettingMenuRemoveKeyboardEventUseCase Test", () =>
{
    it("execute test", () =>
    {
        let keyDown = false;
        window.removeEventListener = vi.fn((type) =>
        {
            if (type === EventType.KEY_DOWN) {
                keyDown = true;
            }
        });

        expect(keyDown).toBe(false);
        execute();
        expect(keyDown).toBe(true);
    });
});