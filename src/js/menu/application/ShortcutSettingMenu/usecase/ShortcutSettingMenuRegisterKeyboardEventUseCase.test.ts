import { execute } from "./ShortcutSettingMenuRegisterKeyboardEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { EventType } from "../../../../tool/domain/event/EventType";

describe("ShortcutSettingMenuRegisterKeyboardEventUseCase Test", () =>
{
    it("execute test", () =>
    {
        let keyDown = false;
        window.addEventListener = vi.fn((type) =>
        {
            if (type === EventType.KEY_DOWN) {
                keyDown = true;
            } else {
                throw new Error("Invalid event type");
            }
        });

        expect(keyDown).toBe(false);
        execute();
        expect(keyDown).toBe(true);
    });
});