import { $CONFIRM_MODAL_NAME } from "../../../../config/MenuConfig";
import { $registerMenu } from "../../MenuUtil";
import { execute } from "./ConfirmModalInstaceResetService";

describe("ConfirmModalInstaceResetServiceTest", () =>
{
    test("execute test", () =>
    {
        const mockMenu = {
            "name": $CONFIRM_MODAL_NAME,
            "instanceObject": "aaa",
            "instanceObjects": [0]
        };
        $registerMenu(mockMenu);

        expect(mockMenu.instanceObject).toBe("aaa");
        expect(mockMenu.instanceObjects.length).toBe(1);
        execute();
        expect(mockMenu.instanceObject).toBe(null);
        expect(mockMenu.instanceObjects.length).toBe(0);

    });
});