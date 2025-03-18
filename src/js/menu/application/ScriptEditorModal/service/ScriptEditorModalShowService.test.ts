import { $SCRIPT_EDITOR_MODAL_NAME } from "../../../../config/MenuConfig";
import { $registerMenu } from "../../MenuUtil";
import { execute } from "./ScriptEditorModalShowService";
import { describe, expect, it, vi } from "vitest";

describe("ScriptEditorModalShowServiceTest", () =>
{
    it("execute test", () =>
    {
        let state = "hide";
        const mockMenu = {
            "name": $SCRIPT_EDITOR_MODAL_NAME,
            "show": vi.fn(() => state = "show")
        };
        $registerMenu(mockMenu);

        expect(state).toBe("hide");
        execute();
        expect(state).toBe("show");
    });
});