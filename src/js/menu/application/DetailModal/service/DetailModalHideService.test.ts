import { $DETAIL_MODAL_NAME } from "../../../../config/MenuConfig";
import { $registerMenu } from "../../MenuUtil";
import { execute } from "./DetailModalHideService";
import { describe, expect, it } from "vitest";

describe("DetailModalHideServiceTest", () =>
{
    it("execute test", () =>
    {
        let state = "show";
        const mockMenu = {
            "name": $DETAIL_MODAL_NAME,
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