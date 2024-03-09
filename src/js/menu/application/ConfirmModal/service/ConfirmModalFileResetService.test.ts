import { $CONFIRM_MODAL_NAME } from "../../../../config/MenuConfig";
import { $registerMenu } from "../../MenuUtil";
import { execute } from "./ConfirmModalFileResetService";

describe("ConfirmModalFileResetServiceTest", () =>
{
    test("execute test", () =>
    {
        const mockMenu = {
            "name": $CONFIRM_MODAL_NAME,
            "fileObject": "aaa",
            "fileObjects": [0]
        };
        $registerMenu(mockMenu);

        expect(mockMenu.fileObject).toBe("aaa");
        expect(mockMenu.fileObjects.length).toBe(1);
        execute();
        expect(mockMenu.fileObject).toBe(null);
        expect(mockMenu.fileObjects.length).toBe(0);

    });
});