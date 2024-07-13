import { execute } from "./RoundRectToolMouseOutEventService";
import { $setCursor } from "../../../../global/GlobalUtil";

describe("RoundRectToolMouseOutEventServiceTest", () =>
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