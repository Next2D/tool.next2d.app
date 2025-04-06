import { execute } from "./TimelineHeaderIconRegistePointerEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { EventType } from "../../../../tool/domain/event/EventType";

describe("TimelineHeaderIconRegistePointerEventUseCase Test", () =>
{
    it("execute test script", (): void =>
    {
        const div = document.createElement("div");
        let pointerId = 0;
        div.setPointerCapture = vi.fn((pointer_id) => { pointerId = pointer_id; });

        let pointerMove = false;
        let pointerUp = false;
        let pointerCancel = false;
        div.addEventListener = vi.fn((type) =>
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

                default:
                    throw new Error("Unknown event type");

            }
        });

        const mockEvent = {
            "target": div,
            "pointerId": 1
        } as unknown as PointerEvent;

        expect(pointerId).toBe(0);
        expect(pointerMove).toBe(false);
        expect(pointerUp).toBe(false);
        expect(pointerCancel).toBe(false);

        execute(mockEvent);

        expect(pointerId).toBe(1);
        expect(pointerMove).toBe(true);
        expect(pointerUp).toBe(true);
        expect(pointerCancel).toBe(true);
    });
});