import { execute } from "./SoundAreaVolumePointerDownEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { EventType } from "../../../../tool/domain/event/EventType";
import { soundArea } from "../../../../controller/domain/model/SoundArea";

describe("SoundAreaVolumePointerDownEventUseCase Test", () =>
{
    it("execute test", async () =>
    {
        const input = document.createElement("input");
        input.dataset.index = "0";

        let pointerId = 0;
        input.setPointerCapture = vi.fn((pointer_id) => { pointerId = pointer_id; });

        let pointerMove = false;
        let pointerUp = false;
        let pointerCancel = false;
        input.addEventListener = vi.fn((type) => 
        {
            switch (type) {
                case EventType.POINTER_MOVE:
                    pointerMove = true;
                    return ;
                case EventType.POINTER_UP:
                    pointerUp = true;
                    return ;
                case EventType.POINTER_CANCEL:
                    pointerCancel = true;
                    return ;
                default:
                    throw new Error(`Unknown event type: ${type}`);
            }
        });

        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "pointerId": 100,
            "button": 0,
            "stopPropagation": vi.fn(() => { stopPropagation = true; }),
            "preventDefault": vi.fn(() => { preventDefault = true; }),
            "currentTarget": input
        } as unknown as PointerEvent;

        soundArea.targetIndex = -1
        expect(soundArea.targetIndex).toBe(-1);
        expect(pointerId).toBe(0);
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect(pointerMove).toBe(false);
        expect(pointerUp).toBe(false);
        expect(pointerCancel).toBe(false);

        execute(mockEvent);

        expect(soundArea.targetIndex).toBe(0);
        expect(pointerId).toBe(100);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect(pointerMove).toBe(true);
        expect(pointerUp).toBe(true);
        expect(pointerCancel).toBe(true);
    });
});