import { $CONFIRM_MODAL_NAME } from "../../../../config/MenuConfig";
import { $registerMenu } from "../../MenuUtil";
import { execute } from "./ConfirmModalFileResetService";

describe("ConfirmModalFileResetServiceTest", () =>
{
    test("execute test", () =>
    {
        const mockFile = {
            "name": "fileName"
        };

        const mockMenu = {
            "name": $CONFIRM_MODAL_NAME,
            "fileObjects": [{
                "file": mockFile,
                "path": "test"
            }]
        };
        $registerMenu(mockMenu);

        expect(mockMenu.fileObjects[0].file).toBe(mockFile);
        expect(mockMenu.fileObjects[0].path).toBe("test");
        expect(mockMenu.fileObjects.length).toBe(1);
        execute();
        expect(mockMenu.fileObjects.length).toBe(0);

    });
});