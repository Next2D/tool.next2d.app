import { execute } from "./MovieClipRegisterEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { EventType } from "../../../../tool/domain/event/EventType";

describe("MovieClipRegisterEventUseCase Test", () =>
{
    it("test case", () =>
    {
        const div = document.createElement("div");

        let pointerDown = false;
        div.addEventListener = vi.fn((type) =>
        {
            if (type === EventType.POINTER_DOWN) {
                pointerDown = true;
            } else {
                throw new Error("Invalid event type");
            }
        });

        expect(pointerDown).toBe(false);
        execute(div);
        expect(pointerDown).toBe(true);
    });
});