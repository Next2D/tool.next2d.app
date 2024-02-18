import { $CONFIRM_MODAL_NAME } from "../../../../config/MenuConfig";
import { $registerMenu } from "../../MenuUtil";
import { execute } from "./ConfirmModalFilePushService";

describe("ConfirmModalFilePushServiceTest", () =>
{
    test("execute test", () =>
    {
        const mockMenu = {
            "name": $CONFIRM_MODAL_NAME,
            "fileObjects": []
        };
        $registerMenu(mockMenu);

        const mockFile = {
            "name": "fileName"
        };
        expect(mockMenu.fileObjects.length).toBe(0);
        execute(mockFile, "test");
        expect(mockMenu.fileObjects.length).toBe(1);
        expect(mockMenu.fileObjects[0].file).toBe(mockFile);
        expect(mockMenu.fileObjects[0].path).toBe("test");
    });
});