import { execute } from "./ControllerPointerDownEventService";
import { $registerMenu } from "../../../../menu/application/MenuUtil";
import { describe, expect, it } from "vitest";

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
        let preventDefault = false;
        const eventMock = {
            "stopPropagation": () =>
            {
                stopPropagation = true;
            },
            "preventDefault": () =>
            {
                preventDefault = true;
            },
            "button": 0
        } as PointerEvent;

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect(menuState).toBe("show");

        execute(eventMock);

        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect(menuState).toBe("hide");
    });
});