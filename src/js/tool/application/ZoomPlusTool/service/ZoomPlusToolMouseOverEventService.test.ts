import { execute } from "./ZoomPlusToolMouseOverEventService";
import { $setCursor } from "../../../../global/GlobalUtil";
import { $registerDefaultTool } from "../../ToolUtil";
import { $TOOL_ZOOM_PLUS_NAME } from "../../../../config/ToolConfig";

describe("ZoomPlusToolMouseOverEventServiceeTest", () =>
{
    test("execute test", () =>
    {
        const mock = {
            "name": $TOOL_ZOOM_PLUS_NAME,
            "cursor": "zoom-in"
        };
        $registerDefaultTool(mock);

        $setCursor("auto");

        const style = document
            .documentElement
            .style;

        style.setProperty("--tool-cursor", "auto");

        // test case mock1
        expect(style.getPropertyValue("--tool-cursor")).toBe("auto");

        execute({
            "stopPropagation": () => {},
            "preventDefault": () => {}
        });

        expect(style.getPropertyValue("--tool-cursor")).toBe(mock.cursor);
    });
});