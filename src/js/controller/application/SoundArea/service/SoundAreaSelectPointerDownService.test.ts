import { execute } from "./SoundAreaSelectPointerDownService";
import { describe, expect, it, vi } from "vitest";
import { $setEditingElement, $getEditingElement } from "../../../../global/GlobalUtil";

describe("SoundAreaSelectPointerDownService Test", () =>
{
    it("execute test", () =>
    {
        const mockElement = {
            "blur": vi.fn()
        } as unknown as HTMLElement;
        $setEditingElement(mockElement);

        let stopPropagation = false;
        const eventMock = {
            "button": 0,
            "stopPropagation": vi.fn(() => { stopPropagation = true }),
        } as unknown as PointerEvent;

        expect($getEditingElement()).toBe(mockElement);
        expect(stopPropagation).toBe(false);

        execute(eventMock);

        expect($getEditingElement()).toBe(null);
        expect(stopPropagation).toBe(true);
    });
});