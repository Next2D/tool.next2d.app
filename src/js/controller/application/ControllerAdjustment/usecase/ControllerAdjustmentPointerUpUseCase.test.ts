import { execute } from "./ControllerAdjustmentPointerUpUseCase";
import { EventType } from "../../../../tool/domain/event/EventType";
import { describe, expect, it, vi } from "vitest";

describe("ControllerAdjustmentPointerUpUseCase Test", () =>
{
    it("test case", () =>
    {
        const div = document.createElement("div");

        let pointerId = 0;
        let stopPropagation = false;
        const MockEvent = {
            "pointerId": 100,
            "target": div as unknown as EventTarget,
            "stopPropagation": () =>
            {
                stopPropagation = true;
            }
        } as PointerEvent;

        div.releasePointerCapture = vi.fn((pointer_id: number) =>
        {
            pointerId = pointer_id;
        });

        let pointerMove   = false;
        let pointerUp     = false;
        let pointerCancel = false;
        let pointerLeave  = false;
        div.removeEventListener = vi.fn((type: string) =>
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
        expect(pointerId).toBe(0);
        expect(pointerLeave).toBe(false);
        expect(stopPropagation).toBe(false);

        execute(MockEvent);

        expect(pointerMove).toBe(true);
        expect(pointerUp).toBe(true);
        expect(pointerCancel).toBe(true);
        expect(pointerId).toBe(100);
        expect(pointerLeave).toBe(true);
        expect(stopPropagation).toBe(true);
    });
});