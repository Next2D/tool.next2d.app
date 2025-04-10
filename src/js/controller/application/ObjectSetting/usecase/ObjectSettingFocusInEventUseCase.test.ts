import { execute } from "./ObjectSettingFocusInEventUseCase";
import { $useKeyboard } from "../../../../shortcut/ShortcutUtil";
import { describe, expect, it, vi } from "vitest";

describe("ObjectSettingFocusInEventUseCase Test", () =>
{
    it("execute test", () =>
    {
        let stopPropagation = false;
        const eventMock = {
            "stopPropagation": vi.fn(() => { stopPropagation = true }),
            "currentTarget": document.createElement("div")
        } as unknown as FocusEvent;

        expect(stopPropagation).toBe(false);
        expect($useKeyboard()).toBe(false);
        execute(eventMock);
        expect(stopPropagation).toBe(true);
        expect($useKeyboard()).toBe(true);
    });
});