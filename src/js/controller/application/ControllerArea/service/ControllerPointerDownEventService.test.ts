import { execute } from "./ControllerPointerDownEventService";
import { $registerMenu } from "../../../../menu/application/MenuUtil";
import { describe, expect, it, vi } from "vitest";

describe("ControllerPointerDownEventService Test", () =>
{
    it("execute test", () =>
    {
        let menuState = "show";
        $registerMenu({
            "name": "test",
            "hide": () =>
            {
                menuState = "hide";
            }
        });

        let stopPropagation = false;
        const eventMock = {
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true;
            }),
            "button": 0
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        expect(menuState).toBe("show");

        execute(eventMock);

        expect(stopPropagation).toBe(true);
        expect(menuState).toBe("hide");
    });
});