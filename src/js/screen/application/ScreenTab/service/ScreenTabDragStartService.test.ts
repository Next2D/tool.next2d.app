import { execute } from "./ScreenTabDragStartService";
import { $registerMenu } from "../../../../menu/application/MenuUtil";
import { $getDragElement } from "../../ScreenUtil";

describe("ScreenTabDragStartServiceTest", () =>
{
    test("execute test", () =>
    {
        let state = "show";
        const mockMenu = {
            "name": "test",
            "hide": () =>
            {
                state = "hide";
            }
        };
        $registerMenu(mockMenu);

        const div = document.createElement("div");
        const mockEvent = {
            "target": div
        };

        expect($getDragElement()).toBe(null);
        expect(state).toBe("show");
        execute(mockEvent);
        expect($getDragElement()).toBe(div);
        expect(state).toBe("hide");
    });
});