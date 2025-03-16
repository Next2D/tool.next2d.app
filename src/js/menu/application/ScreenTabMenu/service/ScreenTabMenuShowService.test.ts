import { $SCREEN_TAB_MENU_NAME } from "../../../../config/MenuConfig";
import { $registerMenu } from "../../MenuUtil";
import { execute } from "./ScreenTabMenuShowService";
import { describe, expect, it } from "vitest";

describe("ScreenTabMenuShowServiceTest", () =>
{
    it("execute test", () =>
    {
        let state = "hide";
        const mockMenu = {
            "name": $SCREEN_TAB_MENU_NAME,
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