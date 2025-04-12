import { execute } from "./ObjectSettingPointerDownUseCase";
import { describe, expect, it, vi } from "vitest";
import { $setEditingElement, $getEditingElement } from "../../../../global/GlobalUtil";

describe("ObjectSettingPointerDownUseCase Test", () =>
{
    it("execute test", async () =>
    {
        const mockElement = {
            "blur": vi.fn(),
        } as unknown as HTMLElement;
        $setEditingElement(mockElement);
        
        let stopPropagation = false;
        const mockEvent = {
            "stopPropagation": vi.fn(() => { stopPropagation = true })
        } as unknown as PointerEvent;

        expect($getEditingElement()).toBe(mockElement);
        expect(stopPropagation).toBe(false);

        execute(mockEvent);

        expect($getEditingElement()).toBe(null);
        expect(stopPropagation).toBe(true);
    });
});