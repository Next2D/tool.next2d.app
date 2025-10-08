import { execute } from "./ScreenMenuTouchPointerDownUseCase";
import { describe, expect, it, vi } from "vitest";
import { $activeTouchPointers } from "../../../../global/GlobalUtil";

describe("ScreenMenuTouchPointerDownUseCase Test", () =>
{
    it("execute test", () =>
    {
        let stopPropagation = false;
        const mockEvent = {
            "pointerId": 2,
            "pointerType": "touch",
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "preventDefault": vi.fn()
        } as unknown as PointerEvent;

        $activeTouchPointers.add(1);
        $activeTouchPointers.add(mockEvent.pointerId);
        expect(stopPropagation).toBe(false);
        expect($activeTouchPointers.size).toBe(2);

        execute(mockEvent);

        expect(stopPropagation).toBe(true);

        $activeTouchPointers.clear();
    });
});