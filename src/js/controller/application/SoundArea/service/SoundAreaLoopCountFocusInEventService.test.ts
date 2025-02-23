import { execute } from "./SoundAreaLoopCountFocusInEventService";
import { $useKeyboard, $updateKeyLock } from "../../../../shortcut/ShortcutUtil";
import { describe, expect, it, vi } from "vitest";

describe("SoundAreaLoopCountFocusInEventServiceTest", () =>
{
    it("test case", () =>
    {
        const input = document.createElement("input");
        input.style.cursor = "auto";

        let stopPropagation = false;
        let preventDefault  = false;
        const eventMock = {
            "target": input,
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true;
            }),
            "preventDefault": vi.fn(() =>
            {
                preventDefault = true;
            })
        } as unknown as FocusEvent;

        $updateKeyLock(false);
        expect($useKeyboard()).toBe(false);
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect(input.style.cursor).toBe("auto");

        execute(eventMock);

        expect($useKeyboard()).toBe(true);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect(input.style.cursor).toBe("");
    });
});