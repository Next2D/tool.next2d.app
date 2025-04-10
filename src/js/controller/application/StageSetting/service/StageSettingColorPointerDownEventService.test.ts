import { execute } from "./StageSettingColorPointerDownEventService";
import { $useKeyboard } from "../../../../shortcut/ShortcutUtil";
import { describe, expect, it, vi } from "vitest";
import { $setEditingElement, $getEditingElement } from "../../../../global/GlobalUtil";

describe("StageSettingColorPointerDownEventService Test", () =>
{
    it("execute test", () =>
    {
        let stopPropagation = false;
        const eventMock = {
            "stopPropagation": vi.fn(() => { stopPropagation = true }),
        } as unknown as PointerEvent;

        const mockElement = {
            "blur": vi.fn()
        } as unknown as HTMLElement;
        $setEditingElement(mockElement);
        expect($getEditingElement()).toBe(mockElement);

        expect(stopPropagation).toBe(false);

        execute(eventMock);
        
        expect(stopPropagation).toBe(true);
        expect($getEditingElement()).toBe(null);
    });
});