import { execute } from "./StageSettingFocusInEventService";
import { $useKeyboard } from "../../../../shortcut/ShortcutUtil";
import { describe, expect, it } from "vitest";
import { $setEditingElement, $getEditingElement } from "../../../../global/GlobalUtil";

describe("StageSettingFocusInEventServiceTest", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        let preventDefault = false;
        let stopPropagation = false;
        const eventMock = {
            "stopPropagation": () => stopPropagation = true,
            "preventDefault": () => preventDefault = true,
            "currentTarget": div
        } as unknown as FocusEvent;

        $setEditingElement(null);
        expect($getEditingElement()).toBe(null);
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect($useKeyboard()).toBe(false);

        execute(eventMock);
        
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect($useKeyboard()).toBe(true);
        expect($getEditingElement()).toBe(div);
    });
});