import { $setCursor } from "../../../../util/Global";
import { execute } from "./ToolAreaMouseOutEventService";

describe("ToolAreaMouseOutEventServiceTest", () =>
{
    test("execute test", () =>
    {
        const eventMock = {
            "stopPropagation": () => { return null }
        };

        $setCursor("test");
        expect(document.documentElement.style.getPropertyValue("--tool-cursor")).toBe("test");
        execute(eventMock);
        expect(document.documentElement.style.getPropertyValue("--tool-cursor")).toBe("auto");
    });
});