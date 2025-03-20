import { execute } from "./ShortcutSettingMenuKeyboardEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { $setSelectElement } from "../ShortcutSettingMenuUtil";

describe("ShortcutSettingMenuKeyboardEventUseCase Test", () =>
{
    it("execute test case1", () =>
    {
        const parent = document.createElement("div");
        const child = document.createElement("div");
        child.classList.add("command");
        parent.appendChild(child);
        $setSelectElement(parent);
 
        let stopPropagation = false;
        let stopImmediatePropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "key": "A",
            "shiftKey": true,
            "altKey": false,
            "ctrlKey": false,
            "metaKey": false,
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "stopImmediatePropagation": vi.fn(() => stopImmediatePropagation = true),
            "preventDefault": vi.fn(() => preventDefault = true),
        } as unknown as KeyboardEvent;

        expect(stopPropagation).toBe(false);
        expect(stopImmediatePropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect(child.textContent).toBe("");

        execute(mockEvent);

        expect(stopPropagation).toBe(true);
        expect(stopImmediatePropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect(child.textContent).toBe("Shift + A");
    });
});