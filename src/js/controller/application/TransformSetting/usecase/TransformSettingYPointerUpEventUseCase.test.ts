import { execute } from "./TransformSettingYPointerUpEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { EventType } from "../../../../tool/domain/event/EventType";

describe("TransformSettingYPointerUpEventUseCase Test", () =>
{
    it("execute test", async () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();

        const input = document.createElement("input");
        input.value = "100";

        let pointerId = 0;
        input.releasePointerCapture = vi.fn((pointer_id) =>
        {
            pointerId = pointer_id;
        });

        let pointerMove = false;
        let pointerUp = false;
        let pointerCancel = false;
        let pointerLeave = false;
        input.removeEventListener = vi.fn((type) =>
        {
            switch (type)
            {
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
                    throw new Error("Unknown event type");

            }
        });

        let focus = false;
        input.focus = vi.fn(() =>
        {
            focus = true;
        });

        let stopPropagation = false;
        const mockEvent = {
            target: input,
            pointerId: 100,
            stopPropagation: vi.fn(() =>
            {
                stopPropagation = true;
            }),
        } as unknown as PointerEvent;

        expect(pointerId).toBe(0);
        expect(stopPropagation).toBe(false);
        expect(pointerMove).toBe(false);
        expect(pointerUp).toBe(false);
        expect(pointerCancel).toBe(false);
        expect(pointerLeave).toBe(false);
        expect(focus).toBe(false);

        await execute(mockEvent);

        expect(pointerId).toBe(100);
        expect(stopPropagation).toBe(true);
        expect(pointerMove).toBe(true);
        expect(pointerUp).toBe(true);
        expect(pointerCancel).toBe(true);
        expect(pointerLeave).toBe(true);
        expect(focus).toBe(true);
    });
});