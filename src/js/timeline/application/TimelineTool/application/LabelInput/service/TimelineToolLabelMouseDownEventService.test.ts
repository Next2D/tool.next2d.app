import { execute } from "./TimelineToolLabelMouseDownEventService";
import { $registerMenu } from "../../../../../../menu/application/MenuUtil";

describe("TimelineToolLabelMouseDownEventServiceTest", () =>
{
    test("test case", () =>
    {

        const eventMock = {
            "stopPropagation": () => {},
        };

        let state = "show";
        const mockMenu = {
            "name": "test",
            "hide": () =>
            {
                state = "hide";
            }
        };
        $registerMenu(mockMenu);

        expect(state).toBe("show");
        execute(eventMock);
        expect(state).toBe("hide");
    });
});