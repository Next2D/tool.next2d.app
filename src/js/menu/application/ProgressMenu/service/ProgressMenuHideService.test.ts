import { $PROGRESS_MENU_NAME } from "../../../../config/MenuConfig";
import { $registerMenu } from "../../MenuUtil";
import { execute } from "./ProgressMenuHideService";
import { describe, expect, it } from "vitest";

describe("ProgressMenuHideServiceTest", () =>
{
    it("execute test", () =>
    {
        let state = "show";
        const mockMenu = {
            "name": $PROGRESS_MENU_NAME,
            "hide": () =>
            {
                state = "hide";
            }
        };
        $registerMenu(mockMenu);

        expect(state).toBe("show");
        execute();
        expect(state).toBe("hide");
    });
});