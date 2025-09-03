import { execute } from "./ArrowToolStageRectPointerUpEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { EventType } from "../../../../tool/domain/event/EventType";

describe("ArrowToolStageRectPointerUpEventUseCase Test", () =>
{
    it("execute test", () =>
    {
        const element = document.createElement("div");
        element.releasePointerCapture = vi.fn();

        let pointerMove = false;
        let pointerUp = false;
        let pointerCancel = false;
        let pointerLeave = false;
        element.removeEventListener = vi.fn((type) =>
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
            }
        });

        let stopPropagation = false;
        const mockEvent = {
            "target": element,
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true;
            })
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        expect(pointerMove).toBe(false);
        expect(pointerUp).toBe(false);
        expect(pointerCancel).toBe(false);
        expect(pointerLeave).toBe(false);

        execute(mockEvent);

        expect(stopPropagation).toBe(true);
        expect(pointerMove).toBe(true);
        expect(pointerUp).toBe(true);
        expect(pointerCancel).toBe(true);
        expect(pointerLeave).toBe(true);
    });
});