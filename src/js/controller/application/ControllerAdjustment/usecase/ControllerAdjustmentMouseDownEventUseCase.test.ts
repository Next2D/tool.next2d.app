import { execute } from "./ControllerAdjustmentMouseDownEventUseCase";
import { $CONTROLLER_ADJUSTMENT_ID } from "../../../../config/ControllerConfig";
import { describe, expect, it, vi } from "vitest";

describe("ControllerAdjustmentMouseDownEventUseCase Test", () =>
{
    it("test case", () =>
    {
        const div = document.createElement("input");
        div.id = $CONTROLLER_ADJUSTMENT_ID;
        document.body.appendChild(div);

        let pointerId = 0;
        let stopPropagation = false;
        const MockEvent = {
            "pointerId": 100,
            "stopPropagation": () =>
            {
                stopPropagation = true;
            },
        } as PointerEvent;

        div.setPointerCapture = vi.fn((pointer_id: number) =>
        {
            pointerId = pointer_id;
        });

        let pointerMove = false;
        let pointerUp   = false;
        div.addEventListener = vi.fn((type: string) =>
        {
            switch (type) {
                case "pointermove":
                    pointerMove = true;
                    break;
                case "pointerup":
                    pointerUp = true;
                    break;
                default:
                    throw new Error("Invalid type");
            }
        });

        expect(pointerMove).toBe(false);
        expect(pointerUp).toBe(false);
        expect(pointerId).toBe(0);
        expect(stopPropagation).toBe(false);

        execute(MockEvent);

        expect(pointerMove).toBe(true);
        expect(pointerUp).toBe(true);
        expect(pointerId).toBe(100);
        expect(stopPropagation).toBe(true);

        document.body.removeChild(div);
    });
});