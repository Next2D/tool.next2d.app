import { execute } from "./ScreenMenuInitializeRegisterEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { $SCREEN_ID } from "../../../../config/ScreenConfig";
import { EventType } from "../../../../tool/domain/event/EventType";

describe("ScreenMenuInitializeRegisterEventUseCase Test", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = $SCREEN_ID;

        let contextmenu = false;
        let pointerDown = false;
        let pointerUp = false;
        let pointerCancel = false;
        div.addEventListener = vi.fn((type) =>
        {
            switch (type) {
                case "contextmenu":
                    contextmenu = true;
                    return;

                case EventType.POINTER_DOWN:
                    pointerDown = true;
                    return;

                case EventType.POINTER_UP:
                    pointerUp = true;
                    return;

                case EventType.POINTER_CANCEL:
                    pointerCancel = true;
                    return;

            }
        });

        expect(contextmenu).toBe(false);
        expect(pointerDown).toBe(false);
        expect(pointerUp).toBe(false);
        expect(pointerCancel).toBe(false);

        execute();

        expect(contextmenu).toBe(true);
        expect(pointerDown).toBe(true);
        expect(pointerUp).toBe(true);
        expect(pointerCancel).toBe(true);

        div.remove();
    });
});