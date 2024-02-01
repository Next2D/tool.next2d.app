import { execute } from "./ScriptEditorModalUpdateTitleService";
import { $SCRIPT_EDITOR_TITLE_ID } from "../../../../config/ScriptEditorModalConfig";

describe("ScriptEditorModalUpdateTitleServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = $SCRIPT_EDITOR_TITLE_ID;

        expect(div.textContent).toBe("");
        execute("test", 20);
        expect(div.textContent).toBe("test / frame [20]");

        div.remove();
    });
});