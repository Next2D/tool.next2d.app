import { $registerMenu } from "../../MenuUtil";
import { execute } from "./UserSettingMenuShowService";
import { $USER_MENU_NAME } from "../../../../config/MenuConfig";
import { describe, expect, it } from "vitest";

describe("UserSettingMenuShowServiceTest", () =>
{
    it("execute test", () =>
    {
        let state = "hide";
        const menuMock = {
            "name": $USER_MENU_NAME,
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