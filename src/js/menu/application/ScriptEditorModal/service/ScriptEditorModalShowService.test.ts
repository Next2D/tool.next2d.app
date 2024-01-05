import { $SCRIPT_EDITOR_MODAL_NAME } from "../../../../config/MenuConfig";
import { $registerMenu } from "../../MenuUtil";
import { execute } from "./ScriptEditorModalShowService";

describe("ScriptEditorModalShowServiceTest", () =>
{
    test("execute test", () =>
    {
        let state = "hide";
        const mockMenu = {
            "name": $SCRIPT_EDITOR_MODAL_NAME,
            "show": () =>
            {
                state = "show";
            }
        };
        $registerMenu(mockMenu);

        expect(state).toBe("hide");
        execute();
        expect(state).toBe("show");
    });
});