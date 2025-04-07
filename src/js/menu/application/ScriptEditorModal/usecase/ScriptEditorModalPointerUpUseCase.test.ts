import { execute } from "./ScriptEditorModalPointerUpUseCase";
import { describe, expect, it, vi } from "vitest";
import { EventType } from "../../../../tool/domain/event/EventType";

describe("ScriptEditorModalPointerUpUseCase Test", () =>
{
    it("execute test", async () =>
    {
        const div = document.createElement("div");

        let pointerDown = false;
        let pointerUp = false;
        let pointerCancel = false;
        div.removeEventListener = vi.fn((type) =>
        {
            switch (type) {

                case EventType.POINTER_MOVE:
                    pointerDown = true;
                    break;

                case EventType.POINTER_UP:
                    pointerUp = true;
                    break;

                case EventType.POINTER_CANCEL:
                    pointerCancel = true;
                    break;

                default:
                    throw new Error("Invalid event type");

            }
        });

        let pointerId = 0;
        div.releasePointerCapture = vi.fn((pointer_id) => pointerId = pointer_id);

        let stopPropagation = false;
        let preventDefault = false;
        const eventMock = {
            "target": div,
            "pointerId": 100,
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "preventDefault": vi.fn(() => preventDefault = true)
        } as unknown as PointerEvent;

        expect(pointerId).toBe(0);
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect(pointerDown).toBe(false);
        expect(pointerUp).toBe(false);
        expect(pointerCancel).toBe(false);

        execute(eventMock);
        
        expect(pointerId).toBe(100);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect(pointerDown).toBe(true);
        expect(pointerUp).toBe(true);
        expect(pointerCancel).toBe(true);
    });
});