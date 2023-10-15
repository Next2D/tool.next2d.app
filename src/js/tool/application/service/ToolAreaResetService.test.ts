import { $getActiveTool, $registerDefaultTool, $setActiveTool } from "../Tool";
import { execute } from "./ToolAreaResetService";

describe("ToolAreaResetServiceTest", () =>
{
    test("execute test", () =>
    {
        let arrowToolState = "off";
        const arrowToolMock = {
            "name": "arrow",
            "dispatchEvent": () => {
                arrowToolState = "on";
            }
        };

        let testToolState = "on";
        const testToolMock = {
            "name": "test",
            "dispatchEvent": () => {
                testToolState = "off";
            }
        };

        $registerDefaultTool(arrowToolMock);
        $registerDefaultTool(testToolMock);
        $setActiveTool(testToolMock);

        testToolState = "on";
        expect(arrowToolState).toBe("off");
        expect(testToolState).toBe("on");
        expect($getActiveTool()).toBe(testToolMock);

        execute();

        expect(arrowToolState).toBe("on");
        expect(testToolState).toBe("off");
        expect($getActiveTool()).toBe(arrowToolMock);
    });
});