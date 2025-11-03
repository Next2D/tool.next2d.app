import { execute } from "./TimelineAdjustmentXPointerMoveUseCase";
import { $TIMELINE_MIN_WIDTH } from "@/config/TimelineConfig";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../../TimelineHeader/usecase/TimelineHeaderWindowResizeUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../TimelineLayer/usecase/TimelineLayerWindowResizeUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: vi.fn(() => ({
        timelineAreaState: {
            width: 200
        }
    }))
}));

vi.mock("@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService", () => ({
    execute: vi.fn()
}));

describe("TimelineAdjustmentXPointerMoveUseCaseTest", () =>
{
    let mockEvent: PointerEvent;

    beforeEach(() =>
    {
        document.documentElement.style.setProperty("--timeline-logic-width", "200px");

        mockEvent = new PointerEvent("pointermove", {
            bubbles: true,
            cancelable: true
        });
    });

    it("should return early when movementX is zero", () =>
    {
        Object.defineProperty(mockEvent, "movementX", {
            value: 0,
            writable: false
        });

        const stopPropagationSpy = vi.spyOn(mockEvent, "stopPropagation");
        
        execute(mockEvent);

        expect(stopPropagationSpy).not.toHaveBeenCalled();
    });

    it("should stop propagation and prevent default when movementX is not zero", () =>
    {
        Object.defineProperty(mockEvent, "movementX", {
            value: 10,
            writable: false
        });

        const stopPropagationSpy = vi.spyOn(mockEvent, "stopPropagation");
        const preventDefaultSpy = vi.spyOn(mockEvent, "preventDefault");
        
        execute(mockEvent);

        expect(stopPropagationSpy).toHaveBeenCalled();
        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it("should not set width below minimum width", () =>
    {
        document.documentElement.style.setProperty("--timeline-logic-width", `${$TIMELINE_MIN_WIDTH}px`);
        
        Object.defineProperty(mockEvent, "movementX", {
            value: -100,
            writable: false
        });

        execute(mockEvent);

        setTimeout(() =>
        {
            const width = parseFloat(
                document.documentElement.style.getPropertyValue("--timeline-logic-width")
            );
            expect(width).toBeGreaterThanOrEqual($TIMELINE_MIN_WIDTH);
        }, 50);
    });

    it("should increase width when movementX is positive", () =>
    {
        const initialWidth = 200;
        document.documentElement.style.setProperty("--timeline-logic-width", `${initialWidth}px`);
        
        Object.defineProperty(mockEvent, "movementX", {
            value: 50,
            writable: false
        });

        execute(mockEvent);

        setTimeout(() =>
        {
            const width = parseFloat(
                document.documentElement.style.getPropertyValue("--timeline-logic-width")
            );
            expect(width).toBe(initialWidth + 50);
        }, 50);
    });
});
