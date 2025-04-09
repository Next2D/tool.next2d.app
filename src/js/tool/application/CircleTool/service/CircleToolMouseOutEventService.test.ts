import { execute } from "./CircleToolMouseOutEventService";
import { $setCursor } from "../../../../global/GlobalUtil";
import { describe, expect, it } from "vitest";

describe("CircleToolMouseOutEventServiceTest", () =>
{
    it("execute test", () =>
    {
        $setCursor("test");

        const style = document
            .documentElement
            .style;

        // test case mock1
        expect(style.getPropertyValue("--tool-cursor")).toBe("test");

        execute({
            "stopPropagation": () => {},
            "preventDefault": () => {}
        } as unknown as PointerEvent);

        expect(style.getPropertyValue("--tool-cursor")).toBe("auto");
    });
});