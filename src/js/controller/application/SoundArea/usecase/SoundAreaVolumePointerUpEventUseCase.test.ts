import { execute } from "./SoundAreaVolumePointerUpEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { $setCursor } from "../../../../global/GlobalUtil";
import { EventType } from "../../../../tool/domain/event/EventType";
import { soundArea } from "../../../../controller/domain/model/SoundArea";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";

describe("SoundAreaVolumePointerUpEventUseCase Test", () =>
{
    it("execute test", async () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const movieClip = workSpace.scene;

        const soundObject = {
            libraryId: 2,
            volume: 100,
            autoPlay: false,
            loopCount: 0
        };
    
        movieClip.setSound(movieClip.currentFrame, soundObject);

        const input = document.createElement("input");
        input.dataset.index = "0";
        input.value = "1";

        let pointerId = 0;
        input.releasePointerCapture = vi.fn((pointer_id) => { pointerId = pointer_id; });

        let pointerMove = false;
        let pointerUp = false;
        let pointerCancel = false;
        let pointerLeave = false;
        input.removeEventListener = vi.fn((type) =>
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

        let focus = false;
        input.focus = vi.fn(() => { focus = true; });

        let stopPropagation = false;
        const mockEvent = {
            "stopPropagation": vi.fn(() => { stopPropagation = true; }),
            "pointerId": 100,
            "target": input
        } as unknown as PointerEvent;

        const style = document
            .documentElement
            .style;
            
        $setCursor("ew-resize");
        expect(style.getPropertyValue("--tool-cursor")).toBe("ew-resize");

        soundArea.targetIndex = 0;
        expect(stopPropagation).toBe(false);
        expect(pointerMove).toBe(false);
        expect(pointerUp).toBe(false);
        expect(pointerCancel).toBe(false);
        expect(pointerLeave).toBe(false);
        expect(pointerId).toBe(0);
        expect(focus).toBe(false);
        expect(soundArea.targetIndex).toBe(0);
        expect(soundObject.volume).toBe(100);

        await execute(mockEvent);

        expect(stopPropagation).toBe(true);
        expect(pointerMove).toBe(true);
        expect(pointerUp).toBe(true);
        expect(pointerCancel).toBe(true);
        expect(pointerLeave).toBe(true);
        expect(pointerId).toBe(100);
        expect(focus).toBe(true);
        expect(style.getPropertyValue("--tool-cursor")).toBe("auto");
        expect(soundArea.targetIndex).toBe(-1);
        expect(soundObject.volume).toBe(1);
    });
});