import { $CONFIRM_MODAL_NAME } from "../../../../config/MenuConfig";
import { $registerMenu } from "../../MenuUtil";
import { execute } from "./ConfirmModalFileResetService";
import { describe, expect, it } from "vitest";

describe("ConfirmModalFileResetServiceTest", () =>
{
    it("execute test", () =>
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