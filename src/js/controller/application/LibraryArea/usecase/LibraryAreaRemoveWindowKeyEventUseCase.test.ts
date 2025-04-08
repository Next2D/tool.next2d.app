import { execute } from "./LibraryAreaRemoveWindowKeyEventUseCase";
import { describe, expect, it, vi } from "vitest";

describe("LibraryAreaRemoveWindowKeyEventUseCase Test", () =>
{
    it("execute test case1", () =>
    {
        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true;
            }),
            "preventDefault": vi.fn(() => { preventDefault = true; }),
        } as unknown as PointerEvent;

        let keydown = false;
        window.removeEventListener = vi.fn((type) =>
        {
            if (type === "keydown") {
                keydown = true;
            }
        });

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect(keydown).toBe(false);
        
        execute(mockEvent);
        
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect(keydown).toBe(true);
    });
});