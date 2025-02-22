import { execute } from "./ScriptAreaParentElementRegisterEventUseCase";
import { EventType } from "../../../../tool/domain/event/EventType";
import { describe, expect, it, vi } from "vitest";

describe("ScriptAreaParentElementRegisterEventUseCase Test", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");

        let pointerDown = false;
        div.addEventListener = vi.fn((type) =>
        {
            if (EventType.POINTER_DOWN === type) {
                pointerDown = true;
            }
        });

        expect(pointerDown).toBe(false);
        execute(div);
        expect(pointerDown).toBe(true);
    });
});