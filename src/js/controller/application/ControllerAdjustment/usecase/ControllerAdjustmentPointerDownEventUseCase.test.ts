import { execute } from "./ControllerAdjustmentPointerDownEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { EventType } from "../../../../tool/domain/event/EventType";

describe("ControllerAdjustmentPointerDownEventUseCase Test", () =>
{
    it("test case", () =>
    {
        const div = document.createElement("div");
        
        let pointerId = 0;
        let stopPropagation = false;
        const MockEvent = {
            "button": 0,
            "target": div,
            "pointerId": 100,
            "stopPropagation": () =>
            {
                stopPropagation = true;
            }
        } as unknown as PointerEvent;

        div.setPointerCapture = vi.fn((pointer_id: number) =>
        {
            pointerId = pointer_id;
        });

        let pointerMove  = false;
        let pointerUp    = false;
        let pointerCancel = false;
        let pointerLeave = false;
        div.addEventListener = vi.fn((type: string) =>
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
                    throw new Error("Invalid type");
            }
        });

        expect(pointerMove).toBe(false);
        expect(pointerUp).toBe(false);
        expect(pointerCancel).toBe(false);
        expect(pointerLeave).toBe(false);
        expect(pointerId).toBe(0);
        expect(stopPropagation).toBe(false);

        execute(MockEvent);

        expect(pointerMove).toBe(true);
        expect(pointerUp).toBe(true);
        expect(pointerCancel).toBe(true);
        expect(pointerLeave).toBe(true);
        expect(pointerId).toBe(100);
        expect(stopPropagation).toBe(true);
    });
});