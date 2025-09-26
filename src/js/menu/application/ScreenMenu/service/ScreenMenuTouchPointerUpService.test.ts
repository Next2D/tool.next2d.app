import { execute } from "./ScreenMenuTouchPointerUpService";
import { describe, expect, it, vi } from "vitest";
import { $activeTouchPointers } from "../../../../global/GlobalUtil";

describe("ScreenMenuTouchPointerUpService Test", () =>
{
    it("execute test", () =>
    {
        let stopPropagation = false;
        const mockEvent = {
            "pointerId": 1,
            "pointerType": "touch",
            "stopPropagation": vi.fn(() => stopPropagation = true),
        } as unknown as PointerEvent;

        $activeTouchPointers.add(mockEvent.pointerId);
        expect(stopPropagation).toBe(false);
        expect($activeTouchPointers.size).toBe(1);

        execute(mockEvent);

        expect(stopPropagation).toBe(true);
        expect($activeTouchPointers.size).toBe(0);
    });
});