import { execute } from "./BitmapRegisterEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { EventType } from "../../../../tool/domain/event/EventType";

describe("BitmapRegisterEventUseCase Test", () =>
{
    it("test case", () =>
    {
        const div = document.createElement("div");

        let pointerEvent = false;
        div.addEventListener = vi.fn((type) =>
        {
            if (type === EventType.POINTER_DOWN) {
                pointerEvent = true;
            } else {
                throw new Error("Invalid event type");
            }
        });

        expect(pointerEvent).toBe(false);
        execute(div);
        expect(pointerEvent).toBe(true);
    });
});