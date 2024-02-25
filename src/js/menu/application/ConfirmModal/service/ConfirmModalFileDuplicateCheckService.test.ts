import { $CONFIRM_MODAL_NAME } from "../../../../config/MenuConfig";
import { $registerMenu } from "../../MenuUtil";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";
import { Bitmap } from "../../../../core/domain/model/Bitmap";
import { Folder } from "../../../../core/domain/model/Folder";
import { execute } from "./ConfirmModalFileDuplicateCheckService";

describe("ConfirmModalFileDuplicateCheckServiceTest", () =>
{
    test("execute test", () =>
    {
        const mockMenu = {
            "name": $CONFIRM_MODAL_NAME,
            "fileObjects": []
        };
        $registerMenu(mockMenu);

        const mockFile = {
            "name": "test.png"
        };

        const bitmap = new Bitmap({
            "id": 1,
            "name": "test",
            "type": "bitmap"
        });

        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        workSpace.libraries.set(1, bitmap);
        workSpace.pathMap.set("test", 1);

        expect(mockMenu.fileObjects.length).toBe(0);
        execute(workSpace, mockFile, "");

        expect(mockMenu.fileObjects.length).toBe(1);
        expect(mockMenu.fileObjects[0].file).toBe(mockFile);
        expect(mockMenu.fileObjects[0].path).toBe("");
    });

    test("execute test", () =>
    {
        const mockMenu = {
            "name": $CONFIRM_MODAL_NAME,
            "fileObjects": []
        };
        $registerMenu(mockMenu);

        const mockFile = {
            "name": "logo.png"
        };

        const folder = new Folder({
            "id": 1,
            "name": "test",
            "type": "bitmap"
        });

        const bitmap = new Bitmap({
            "id": 2,
            "name": "logo",
            "type": "bitmap",
            "filderId": 1
        });

        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        workSpace.libraries.set(1, folder);
        workSpace.libraries.set(2, bitmap);
        workSpace.pathMap.set("test", 1);
        workSpace.pathMap.set("test/logo", 2);

        expect(mockMenu.fileObjects.length).toBe(0);
        execute(workSpace, mockFile, "test");

        expect(mockMenu.fileObjects.length).toBe(1);
        expect(mockMenu.fileObjects[0].file).toBe(mockFile);
        expect(mockMenu.fileObjects[0].path).toBe("test");
    });
});