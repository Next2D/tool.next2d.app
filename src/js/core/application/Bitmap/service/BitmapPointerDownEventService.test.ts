import { execute } from "./BitmapPointerDownEventService";
import { describe, expect, it, vi } from "vitest";

describe("BitmapPointerDownEventService Test", () =>
{
    it("test case", () =>
    {
        let stopPropagation = false;
        const mockEvent = {
            button: 0,
            stopPropagation: vi.fn(() => stopPropagation = true),
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        execute(mockEvent);        
        expect(stopPropagation).toBe(true);
    });
});