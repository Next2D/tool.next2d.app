import { $USER_MENU_NAME } from "../../../../config/MenuConfig";
import { $TOOL_USER_SETTING_ID } from "../../../../config/ToolConfig";
import { $registerMenu } from "../../Menu";
import { execute } from "./UserSettingMenuUpdateOffsetService";

describe("UserSettingMenuUpdateOffsetServiceTest", () =>
{
    test("execute test", () =>
    {
        const menuMock = {
            "name": $USER_MENU_NAME,
            "offsetLeft": 0,
            "offsetTop": 0
        };

        const menuDiv = document.createElement("div");
        menuDiv.id = $USER_MENU_NAME;
        document.body.appendChild(menuDiv);

        const toolDiv = document.createElement("div");
        toolDiv.id = $TOOL_USER_SETTING_ID;
        document.body.appendChild(toolDiv);

        $registerMenu(menuMock);
        expect(menuMock.offsetLeft).toBe(0);
        expect(menuMock.offsetTop).toBe(0);

        execute();
        expect(menuMock.offsetLeft).toBe(30);
        expect(menuMock.offsetTop).toBe(80);
    });
});