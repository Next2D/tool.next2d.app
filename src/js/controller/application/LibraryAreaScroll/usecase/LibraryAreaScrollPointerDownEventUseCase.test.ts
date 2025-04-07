import { execute } from "./LibraryAreaScrollPointerDownEventUseCase";
import { EventType } from "../../../../tool/domain/event/EventType";
import { describe, expect, it, vi } from "vitest";

describe("LibraryAreaScrollPointerDownEventUseCase Test", () =>
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
        let pointerCancel = false;
        div.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case EventType.POINTER_MOVE:
                    pointerMove = true
                    break;

                case EventType.POINTER_UP:
                    pointerUp = true
                    break;

                case EventType.POINTER_CANCEL:
                    pointerCancel = true
                    break;

                default:
                    throw new Error("Invalid event type");

            }
        });

        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "target": div,
            "pointerId": 100,
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true;
            }),
            "preventDefault": vi.fn(() => { preventDefault = true }),
        } as unknown as PointerEvent;

        expect(pointerId).toBe(0);
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect(pointerMove).toBe(false);
        expect(pointerUp).toBe(false);
        expect(pointerCancel).toBe(false);

        execute(mockEvent);

        expect(pointerId).toBe(100);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect(pointerMove).toBe(true);
        expect(pointerUp).toBe(true);
        expect(pointerCancel).toBe(true);
    });
});