import { execute } from "./StageSettingWidthRegisterPointerEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { EventType } from "../../../../tool/domain/event/EventType";

describe("StageSettingWidthRegisterPointerEventUseCase Test", () =>
{
    it("execute test", () =>
    {
        const input = document.createElement("input");

        let pointerId = 0;
        input.setPointerCapture = vi.fn((pointer_id) => pointerId = pointer_id);

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
                    throw new Error("Invalid type");

            }
        });

        const mockEvent = {
            "pointerId": 100,
            "target": input,
        } as unknown as PointerEvent;

        expect(pointerId).toBe(0);
        expect(pointerMove).toBe(false);
        expect(pointerUp).toBe(false);
        expect(pointerCancel).toBe(false);

        execute(mockEvent);

        expect(pointerId).toBe(100);
        expect(pointerMove).toBe(true);
        expect(pointerUp).toBe(true);
        expect(pointerCancel).toBe(true);
    });
});