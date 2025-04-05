import { execute } from "./TimelineHeaderTouchPointerDownUseCase";
import { describe, expect, it, vi } from "vitest";
import { $activeTouchPointers } from "../../../../global/GlobalUtil";

describe("TimelineHeaderTouchPointerDownUseCase Test", () =>
{
    it("execute test", () =>
    {
        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "pointerId": 2,
            "pointerType": "touch",
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "preventDefault": vi.fn(() => preventDefault = true)
        } as unknown as PointerEvent;

        $activeTouchPointers.add(1);
        $activeTouchPointers.add(mockEvent.pointerId);
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect($activeTouchPointers.size).toBe(2);

        execute(mockEvent);

        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);

        $activeTouchPointers.clear();
    });
});