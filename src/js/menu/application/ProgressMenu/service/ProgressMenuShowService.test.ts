import { $PROGRESS_MENU_NAME } from "../../../../config/MenuConfig";
import { $registerMenu } from "../../MenuUtil";
import { execute } from "./ProgressMenuShowService";

describe("ProgressMenuShowServiceTest", () =>
{
    test("execute test", () =>
    {
        let state = "hide";
        const mockMenu = {
            "name": $PROGRESS_MENU_NAME,
            "show": () =>
            {
                state = "show";
            }
        };
        $registerMenu(mockMenu);

        expect(state).toBe("hide");
        execute();
        expect(state).toBe("show");
    });
});