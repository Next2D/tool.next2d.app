import { execute } from "./ZoomToolFocusInEventService";
import { $useKeyboard } from "../../../../shortcut/ShortcutUtil";
import { describe, expect, it, vi } from "vitest";

describe("ZoomToolFocusInEventServiceTest", () =>
{
    it("execute test", () =>
    {
        let stopPropagation = false;
        const eventMock = {
            "stopPropagation": vi.fn(() => { stopPropagation = true; }),
            "currentTarget": document.createElement("div")
        } as unknown as FocusEvent;

        expect(stopPropagation).toBe(false);
        expect($useKeyboard()).toBe(false);
        execute(eventMock);
        expect(stopPropagation).toBe(true);
        expect($useKeyboard()).toBe(true);
    });
});