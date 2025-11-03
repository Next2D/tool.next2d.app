import { execute } from "./TimelineAdjustmentYPointerMoveUseCase";
import { $TIMELINE_MIN_HEIGHT, $TIMELINE_ID } from "@/config/TimelineConfig";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/timeline/application/TimelineLayer/service/TimelineLayerUpdateClientHeightService", () => ({
    execute: vi.fn()
}));

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: vi.fn(() => ({
        timelineAreaState: {
            width: 200,
            height: 300,
            state: "default",
            frameHeight: 20,
            offsetTop: 0
        }
    }))
}));

vi.mock("@/timeline/application/TimelineScroll/service/TimelineScrollUpdateHeightService", () => ({
    execute: vi.fn()
}));

vi.mock("@/timeline/application/TimelineScroll/service/TimelineScrollUpdateYPositionService", () => ({
    execute: vi.fn()
}));

vi.mock("@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../TimelineArea/TimelineAreaUtil", () => ({
    $setTimelineOffsetTop: vi.fn()
}));

vi.mock("@/screen/application/ScreenScroll/service/ScreenScrollResizeService", () => ({
    execute: vi.fn()
}));

vi.mock("@/timeline/domain/model/TimelineLayer", () => ({
    timelineLayer: {
        clientHeight: 300,
        numberOfDisplays: 15
    }
}));

describe("TimelineAdjustmentYPointerMoveUseCaseTest", () =>
{
    let mockEvent: PointerEvent;

    beforeEach(() =>
    {
        document.documentElement.style.setProperty("--timeline-height", "300px");
        document.documentElement.style.setProperty("--timeline-logic-height", "300px");

        const timelineElement = document.createElement("div");
        timelineElement.id = $TIMELINE_ID;
        document.body.innerHTML = "";
        document.body.appendChild(timelineElement);

        mockEvent = new PointerEvent("pointermove", {
            bubbles: true,
            cancelable: true
        });
    });

    it("should return early when movementY is zero", () =>
    {
        Object.defineProperty(mockEvent, "movementY", {
            value: 0,
            writable: false
        });

        const stopPropagationSpy = vi.spyOn(mockEvent, "stopPropagation");
        
        execute(mockEvent);

        expect(stopPropagationSpy).not.toHaveBeenCalled();
    });

    it("should stop propagation and prevent default when movementY is not zero", () =>
    {
        Object.defineProperty(mockEvent, "movementY", {
            value: 10,
            writable: false
        });

        const stopPropagationSpy = vi.spyOn(mockEvent, "stopPropagation");
        const preventDefaultSpy = vi.spyOn(mockEvent, "preventDefault");
        
        execute(mockEvent);

        expect(stopPropagationSpy).toHaveBeenCalled();
        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it("should not set height below minimum height", () =>
    {
        document.documentElement.style.setProperty("--timeline-height", `${$TIMELINE_MIN_HEIGHT}px`);
        
        Object.defineProperty(mockEvent, "movementY", {
            value: 100,
            writable: false
        });

        execute(mockEvent);

        setTimeout(() =>
        {
            const height = parseFloat(
                document.documentElement.style.getPropertyValue("--timeline-height")
            );
            expect(height).toBeGreaterThanOrEqual($TIMELINE_MIN_HEIGHT);
        }, 50);
    });

    it("should decrease height when movementY is positive", () =>
    {
        const initialHeight = 300;
        document.documentElement.style.setProperty("--timeline-height", `${initialHeight}px`);
        
        Object.defineProperty(mockEvent, "movementY", {
            value: 50,
            writable: false
        });

        execute(mockEvent);

        setTimeout(() =>
        {
            const height = parseFloat(
                document.documentElement.style.getPropertyValue("--timeline-logic-height")
            );
            expect(height).toBe(initialHeight - 50);
        }, 50);
    });
});
