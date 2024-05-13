import { execute } from "./ZoomPlusToolMouseOutEventService";
import { $setCursor } from "../../../../global/GlobalUtil";

describe("ZoomPlusToolMouseOutEventServiceTest", () =>
{
    test("execute test", () =>
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
        });

        expect(style.getPropertyValue("--tool-cursor")).toBe("auto");
    });
});