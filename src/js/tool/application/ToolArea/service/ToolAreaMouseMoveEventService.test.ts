import { $setActiveTool } from "../../Tool";
import { execute } from "./ToolAreaMouseMoveEventService";
import { EventType } from "../../../domain/event/EventType";

describe("ToolAreaMouseMoveEventServiceTest", () =>
{
    test("execute test", () =>
    {
        let status = "no";

        // mack tool
        const mock = {
            "dispatchEvent": (type: string, event: any) =>
            {
                if (EventType.MOUSE_MOVE !== type) {
                    return ;
                }
                status = event.status;
            },
            "name": "mock"
        };

        const mockEvent = {
            "status": "yes",
            "stopPropagation": () => { return null }
        };

        expect(status).toBe("no");
        execute(mockEvent);
        expect(status).toBe("no");

        $setActiveTool(mock);
        execute(mockEvent);
        expect(status).toBe("yes");
    });
});