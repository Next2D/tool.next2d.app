import { execute } from "./LibraryAreaMouseDownEventUseCase";
import { $useKeyboard, $updateKeyLock } from "../../../../shortcut/ShortcutUtil";
import { $setEditingElement, $getEditingElement, $activeTouchPointers } from "../../../../global/GlobalUtil";
import { describe, expect, it, vi } from "vitest";

describe("LibraryAreaMouseDownEventUseCase Test", () =>
{
    it("execute test case1", () =>
    {
        const div = document.createElement("div");
        div.blur = vi.fn(() => { $updateKeyLock(false); });
        $setEditingElement(div);

        // mock event
        let stopPropagation = false;
        const mockEvent = {
            "stopPropagation": vi.fn(() => { stopPropagation = true; }),
            "button": 0
        } as unknown as PointerEvent;

        $activeTouchPointers.clear();
        expect(stopPropagation).toBe(false);
        $updateKeyLock(true);
        expect($useKeyboard()).toBe(true);
        expect($getEditingElement()).not.toBeNull()

        execute(mockEvent);
        expect(stopPropagation).toBe(true);
        expect($useKeyboard()).toBe(false);
        expect($getEditingElement()).toBeNull();
    });
});