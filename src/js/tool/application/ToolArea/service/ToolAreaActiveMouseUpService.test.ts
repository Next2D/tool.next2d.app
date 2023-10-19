import { $setCursor } from "../../../../util/Global";
import { execute } from "./ToolAreaActiveMouseUpService";

describe("ToolAreaActiveMouseUpServiceTest", () =>
{
    test("execute test", async () =>
    {
        $setCursor("move");
        expect(document.documentElement.style.getPropertyValue("--tool-cursor")).toBe("move");

        const mockEvent = {
            "stopPropagation": () => { return null }
        };

        execute(mockEvent);
        expect(document.documentElement.style.getPropertyValue("--tool-cursor")).toBe("auto");
    });
});