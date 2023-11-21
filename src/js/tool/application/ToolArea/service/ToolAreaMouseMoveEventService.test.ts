import { $setActiveTool } from "../../ToolUtil";
import { execute } from "./ToolAreaMouseMoveEventService";
import { EventType } from "../../../domain/event/EventType";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("ToolAreaMouseMoveEventServiceTest", () =>
{
    test("execute test", () =>
    {
        $createWorkSpace();

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