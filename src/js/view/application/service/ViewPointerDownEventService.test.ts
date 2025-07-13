import { execute } from "./ViewPointerDownEventService";
import { $registerMenu } from "../../../menu/application/MenuUtil";
import { describe, expect, it } from "vitest";

describe("ViewPointerDownEventService Test", () =>
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

        let eventState = "off";
        expect(eventState).toBe("off");
        expect(menuState).toBe("show");

        const eventMock = {
            "stopPropagation": () =>
            {
                eventState = "on";
            },
            "button": 0
        } as unknown as PointerEvent;
        execute(eventMock);

        expect(eventState).toBe("on");
        expect(menuState).toBe("hide");
    });
});