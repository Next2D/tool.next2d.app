import { execute } from "./SoundAreaVolumeFocusInEventService";
import { $updateKeyLock, $useKeyboard } from "../../../../shortcut/ShortcutUtil";
import { describe, expect, it, vi } from "vitest";

describe("SoundAreaVolumeFocusInEventServiceTest", () =>
{
    it("test case", () =>
    {
        const input = document.createElement("input");
        input.style.cursor = "pointer";

        let stopPropagation = false;
        let preventDefault = false;
        const eventMock = {
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true;
            }),
            "preventDefault": vi.fn(() =>
            {
                preventDefault = true;
            }),
            "target": input
        } as unknown as FocusEvent;

        $updateKeyLock(false);
        expect($useKeyboard()).toBe(false);
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect(input.style.cursor).toBe("pointer");

        execute(eventMock);

        expect($useKeyboard()).toBe(true);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect(input.style.cursor).toBe("");
    });
});