import { $SCRIPT_EDITOR_MODAL_NAME } from "../../../../config/MenuConfig";
import { $registerMenu } from "../../MenuUtil";
import { execute } from "./ScriptEditorModalHideService";
import { describe, expect, it } from "vitest";

describe("ScriptEditorModalHideServiceTest", () =>
{
    it("execute test", () =>
    {
        let state = "show";
        const mockMenu = {
            "name": $SCRIPT_EDITOR_MODAL_NAME,
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