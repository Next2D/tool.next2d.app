import { execute } from "./SceneListMenuHideService";
import { $registerMenu } from "../../MenuUtil";
import { $SCENE_LIST_MENU_NAME } from "../../../../config/MenuConfig";

describe("SceneListMenuHideServiceTest", () =>
{
    test("execute test", () =>
    {
        let state = "show";
        const menuMock = {
            "name": $SCENE_LIST_MENU_NAME,
            "offsetLeft": 0,
            "offsetTop": 0,
            "hide": () =>
            {
                state = "hide";
            }
        };
        $registerMenu(menuMock);

        expect(state).toBe("show");
        execute();
        expect(state).toBe("hide");
    });
});