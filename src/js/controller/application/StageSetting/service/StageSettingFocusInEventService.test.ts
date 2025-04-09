import { execute } from "./StageSettingFocusInEventService";
import { $useKeyboard } from "../../../../shortcut/ShortcutUtil";
import { describe, expect, it, vi } from "vitest";
import { $setEditingElement, $getEditingElement } from "../../../../global/GlobalUtil";

describe("StageSettingFocusInEventServiceTest", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        let stopPropagation = false;
        const eventMock = {
            "stopPropagation": vi.fn(() => { stopPropagation = true }),
            "currentTarget": div
        } as unknown as FocusEvent;

        $setEditingElement(null);
        expect($getEditingElement()).toBe(null);
        expect(stopPropagation).toBe(false);
        expect($useKeyboard()).toBe(false);

        execute(eventMock);
        
        expect(stopPropagation).toBe(true);
        expect($useKeyboard()).toBe(true);
        expect($getEditingElement()).toBe(div);
    });
});