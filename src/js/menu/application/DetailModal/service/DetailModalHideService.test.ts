import { $DETAIL_MODAL_NAME } from "../../../../config/MenuConfig";
import { $registerMenu } from "../../MenuUtil";
import { execute } from "./DetailModalHideService";

describe("DetailModalHideServiceTest", () =>
{
    test("execute test", () =>
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