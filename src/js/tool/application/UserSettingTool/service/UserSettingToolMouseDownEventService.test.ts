import { $registerMenu } from "../../../../menu/application/MenuUtil";
import { execute } from "./UserSettingToolMouseDownEventService";

describe("UserSettingMouseDownEventServiceTest", () =>
{
    test("execute test", () =>
    {
        let state = "hide";
        const menuMock = {
            "name": "user-setting",
            "_$state": "hide",
            "show": () =>
            {
                state = "show";
            }
        };
        $registerMenu(menuMock);

        expect(state).toBe("hide");
        execute();
        expect(state).toBe("show");
    });
});