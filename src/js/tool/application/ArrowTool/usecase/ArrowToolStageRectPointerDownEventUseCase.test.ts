import { execute } from "./ArrowToolStageRectPointerDownEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { timelineHeader } from "../../../../timeline/domain/model/TimelineHeader";
import { $activeTouchPointers } from "../../../../global/GlobalUtil";
import { EventType } from "../../../../tool/domain/event/EventType";

describe("ArrowToolStageRectPointerDownEventUseCase Test", () =>
{
    it("execute test case1", () =>
    {
        const element = document.createElement("div");
        element.setPointerCapture = vi.fn((pointer_id) =>
        {
            pointerId = pointer_id;
        });

        let pointerMove = false;
        let pointerUp = false;
        let pointerCancel = false;
        let pointerLeave = false;
        element.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case EventType.POINTER_MOVE:
                    pointerMove = true;
                    break;

                case EventType.POINTER_UP:
                    pointerUp = true;
                    break;

                case EventType.POINTER_CANCEL:
                    pointerCancel = true;
                    break;

                case EventType.POINTER_LEAVE:
                    pointerLeave = true;
                    break;

                default:
                    throw new Error("Error EventType");

            }
        });

        let pointerId = 0;
        let stopPropagation = false;
        const mockEvent = {
            "button": 0,
            "pointerId": 100,
            "target": element,
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true;
            })
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        expect(pointerId).toBe(0);
        expect(pointerMove).toBe(false);
        expect(pointerUp).toBe(false);
        expect(pointerCancel).toBe(false);
        expect(pointerLeave).toBe(false);

        timelineHeader.stopFlag = true;
        execute(mockEvent);
        expect(stopPropagation).toBe(true);
        expect(pointerId).toBe(100);
        expect(pointerMove).toBe(true);
        expect(pointerUp).toBe(true);
        expect(pointerCancel).toBe(true);
        expect(pointerLeave).toBe(true);
    });

    it("execute test case2", () =>
    {
        let stopPropagation = false;
        const mockEvent = {
            "target": document.createElement("div"),
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true;
            }),
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        execute(mockEvent);
        expect(stopPropagation).toBe(false);
    });

    it("execute test case3", () =>
    {
        let stopPropagation = false;
        const mockEvent = {
            "button": 0,
            "target": document.createElement("div"),
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true;
            }),
        } as unknown as PointerEvent;

        $activeTouchPointers.clear();
        $activeTouchPointers.add(1);
        $activeTouchPointers.add(2);
        expect(stopPropagation).toBe(false);
        execute(mockEvent);
        expect(stopPropagation).toBe(false);
        $activeTouchPointers.clear();
    });

    it("execute test case4", () =>
    {
        let stopPropagation = false;
        const mockEvent = {
            "button": 0,
            "target": document.createElement("div"),
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true;
            }),
        } as unknown as PointerEvent;

        timelineHeader.stopFlag = false;
        expect(stopPropagation).toBe(false);
        execute(mockEvent);
        timelineHeader.stopFlag = true;
        expect(stopPropagation).toBe(false);
    });
});