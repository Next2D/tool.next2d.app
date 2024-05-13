import { $TOOL_ZOOM_MINUS_NAME } from "../../../../config/ToolConfig";
import { execute } from "./ZoomMinusToolActiveService";
import { $setActiveTool, $getActiveTool, $registerDefaultTool } from "../../ToolUtil";

describe("ZoomMinusToolActiveServiceTest", () =>
{
    test("execute test", () =>
    {
        const mock1 = {
            "dispatchEvent": () => {},
            "name": "mock1"
        };
        $registerDefaultTool(mock1);

        const mock2 = {
            "dispatchEvent": () => {},
            "name": $TOOL_ZOOM_MINUS_NAME
        };
        $registerDefaultTool(mock2);

        // test case mock1
        $setActiveTool(mock1);
        expect($getActiveTool().name).toBe(mock1.name);

        execute();

        expect($getActiveTool().name).toBe(mock2.name);
    });

});