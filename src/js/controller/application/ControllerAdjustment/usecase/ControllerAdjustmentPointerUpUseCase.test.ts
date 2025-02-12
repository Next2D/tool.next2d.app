import { execute } from "./ControllerAdjustmentPointerUpUseCase";
import { $CONTROLLER_ADJUSTMENT_ID } from "../../../../config/ControllerConfig";
import { describe, expect, it, vi } from "vitest";

describe("ControllerAdjustmentPointerUpUseCase Test", () =>
{
    it("test case", () =>
    {
        const div = document.createElement("div");
        div.id = $CONTROLLER_ADJUSTMENT_ID;
        document.body.appendChild(div);

        let pointerId = 0;
        let stopPropagation = false;
        let preventDefault = false;
        const MockEvent = {
            "pointerId": 100,
            "currentTarget": div as unknown as EventTarget,
            "stopPropagation": () =>
            {
                stopPropagation = true;
            },
            "preventDefault": () =>
            {
                preventDefault = true;
            }
        } as PointerEvent;

        div.releasePointerCapture = vi.fn((pointer_id: number) =>
        {
            pointerId = pointer_id;
        });

        let pointerMove  = false;
        let pointerUp    = false;
        let pointerLeave = false;
        div.removeEventListener = vi.fn((type: string) =>
        {
            switch (type) {
                case "pointermove":
                    pointerMove = true;
                    break;
                case "pointerup":
                    pointerUp = true;
                    break;
                case "pointerleave":
                    pointerLeave = true;
                    break;
                default:
                    throw new Error("Invalid type");
            }
        });

        expect(pointerMove).toBe(false);
        expect(pointerUp).toBe(false);
        expect(pointerLeave).toBe(false);
        expect(pointerId).toBe(0);
        expect(preventDefault).toBe(false);
        expect(stopPropagation).toBe(false);

        execute(MockEvent);

        expect(pointerMove).toBe(true);
        expect(pointerUp).toBe(true);
        expect(pointerLeave).toBe(true);
        expect(pointerId).toBe(100);
        expect(preventDefault).toBe(true);
        expect(stopPropagation).toBe(true);

        document.body.removeChild(div);
    });
});