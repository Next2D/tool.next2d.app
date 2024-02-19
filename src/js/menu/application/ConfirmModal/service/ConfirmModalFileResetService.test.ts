import { $CONFIRM_MODAL_NAME } from "../../../../config/MenuConfig";
import { $registerMenu } from "../../MenuUtil";
import { execute } from "./ConfirmModalFileResetService";

describe("ConfirmModalFileResetServiceTest", () =>
{
    test("execute test", () =>
    {
        const mockMenu = {
            "name": $CONFIRM_MODAL_NAME,
            "fileObjects": [0]
        };
        $registerMenu(mockMenu);

        expect(mockMenu.fileObjects.length).toBe(1);
        execute();
        expect(mockMenu.fileObjects.length).toBe(0);

    });
});