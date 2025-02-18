import { execute } from "./PluginAreaScrollMouseDownUseCase";
import { EventType } from "../../../../tool/domain/event/EventType";
import { describe, expect, it, vi } from "vitest";

describe("PluginAreaScrollMouseDownUseCase Test", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");

        let pointerId = 0;
        div.setPointerCapture = vi.fn((pointer_id) =>
        {
            pointerId = pointer_id
        });

        let pointerMove = false;
        let pointerUp = false;
        let pointerLeave = false;
        div.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case EventType.POINTER_MOVE:
                    pointerMove = true
                    break;

                case EventType.POINTER_UP:
                    pointerUp = true
                    break;

                case EventType.POINTER_LEAVE:
                    pointerLeave = true
                    break;

                default:
                    throw new Error("Invalid event type");

            }
        });

        let stopPropagation = false;
        const mockEvent = {
            "target": div,
            "pointerId": 100,
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true;
            }),
        } as unknown as PointerEvent;

        expect(pointerId).toBe(0);
        expect(stopPropagation).toBe(false);
        expect(pointerMove).toBe(false);
        expect(pointerUp).toBe(false);
        expect(pointerLeave).toBe(false);

        execute(mockEvent);

        expect(pointerId).toBe(100);
        expect(stopPropagation).toBe(true);
        expect(pointerMove).toBe(true);
        expect(pointerUp).toBe(true);
        expect(pointerLeave).toBe(true);
    });
});