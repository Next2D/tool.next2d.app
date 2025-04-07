import { execute } from "./StageSettingFpsPointerUpEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { $setCursor } from "../../../../global/GlobalUtil";
import { EventType } from "../../../../tool/domain/event/EventType";

describe("StageSettingFpsPointerUpEventUseCase Test", () =>
{
    it("execute test", async () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const stage = workSpace.stage;
        stage.fps = 60;

        const input = document.createElement("input");
        input.value = "10";

        let pointerId = 0;
        input.releasePointerCapture = vi.fn((pointer_id) => pointerId = pointer_id);

        let pointerMove = false;
        let pointerUp = false;
        let pointerCancel = false;
        input.removeEventListener = vi.fn((type) =>
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
                    throw new Error("Invalid type");

            }
        });

        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "pointerId": 100,
            "target": input,
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "preventDefault": vi.fn(() => preventDefault = true)
        } as unknown as PointerEvent;

        const style = document
            .documentElement
            .style;
        $setCursor("ew-resize");
        expect(style.getPropertyValue("--tool-cursor")).toBe("ew-resize");

        expect(stage.fps).toBe(60);
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect(pointerId).toBe(0);
        expect(pointerMove).toBe(false);
        expect(pointerUp).toBe(false);
        expect(pointerCancel).toBe(false);

        await execute(mockEvent);

        expect(style.getPropertyValue("--tool-cursor")).toBe("auto");
        expect(stage.fps).toBe(10);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect(pointerId).toBe(100);
        expect(pointerMove).toBe(true);
        expect(pointerUp).toBe(true);
        expect(pointerCancel).toBe(true);
    });
});