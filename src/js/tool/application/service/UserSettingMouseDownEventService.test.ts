import { $registerMenu } from "../../../menu/application/Menu";
import { execute } from "./UserSettingMouseDownEventService";

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