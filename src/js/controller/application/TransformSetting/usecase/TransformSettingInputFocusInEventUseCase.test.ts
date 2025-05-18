import { execute } from "./TransformSettingInputFocusInEventUseCase";
import { $useKeyboard } from "../../../../shortcut/ShortcutUtil";
import { describe, expect, it, vi } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";

describe("TransformSettingInputFocusInEventUseCase", () =>
{
    it("execute test", () =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();

        let stopPropagation = false;
        const eventMock = {
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true;
            }),
            "currentTarget": document.createElement("div")
        } as unknown as FocusEvent;

        expect(stopPropagation).toBe(false);
        expect($useKeyboard()).toBe(false);
        execute(eventMock);
        expect(stopPropagation).toBe(true);
        expect($useKeyboard()).toBe(true);
    });
});