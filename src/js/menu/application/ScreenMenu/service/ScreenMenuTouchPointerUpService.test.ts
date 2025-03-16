import { execute } from "./ScreenMenuTouchPointerUpService";
import { describe, expect, it, vi } from "vitest";
import { $activeTouchPointers } from "../../../../global/GlobalUtil";

describe("ScreenMenuTouchPointerUpService Test", () =>
{
    it("execute test", () =>
    {
        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "pointerId": 1,
            "pointerType": "touch",
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "preventDefault": vi.fn(() => preventDefault = true)
        } as unknown as PointerEvent;

        $activeTouchPointers.add(mockEvent.pointerId);
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect($activeTouchPointers.size).toBe(1);

        execute(mockEvent);

        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect($activeTouchPointers.size).toBe(0);
    });
});