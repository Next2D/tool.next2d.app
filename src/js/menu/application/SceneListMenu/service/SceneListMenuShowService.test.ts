import { execute } from "./SceneListMenuShowService";
import { $registerMenu } from "../../MenuUtil";
import { $SCENE_LIST_MENU_NAME } from "../../../../config/MenuConfig";
import {
    $TIMELINE_ID,
    $TIMELINE_SCENE_LIST_BUTTON_ID,
    $TIMELINE_SCENE_NAME_LIST_ID
} from "../../../../config/TimelineConfig";

describe("SceneListMenuShowServiceTest", () =>
{
    test("execute test", () =>
    {
        let state = "hide";
        const menuMock = {
            "name": $SCENE_LIST_MENU_NAME,
            "show": () =>
            {
                state = "show";
            }
        };
        $registerMenu(menuMock);

        const listElement = document.createElement("div");
        document.body.appendChild(listElement);
        listElement.id = $TIMELINE_SCENE_NAME_LIST_ID;
        listElement.appendChild(document.createElement("div"));

        const element = document.createElement("div");
        document.body.appendChild(element);
        element.id = $TIMELINE_ID;

        const buttonElement = document.createElement("div");
        document.body.appendChild(buttonElement);
        buttonElement.id = $TIMELINE_SCENE_LIST_BUTTON_ID;

        expect(state).toBe("hide");
        execute();
        expect(state).toBe("show");

        listElement.remove();
        element.remove();
        buttonElement.remove();
    });
});