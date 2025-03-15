import { execute } from "./TextPointerDownEventUseCase";
import { describe, expect, it, vi } from "vitest";

describe("TextPointerDownEventUseCase Test", () =>
{
    it("test case", () =>
    {
        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "button": 0,
            "target": document.createElement("div"),
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "preventDefault": vi.fn(() => preventDefault = true)
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);

        execute(mockEvent);
        
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
    });
});