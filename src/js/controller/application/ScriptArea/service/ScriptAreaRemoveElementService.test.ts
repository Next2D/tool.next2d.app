import { execute } from "./ScriptAreaRemoveElementService";
import { $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_BOX_ID } from "../../../../config/ControllerScriptAreaConfig";

describe("ScriptAreaRemoveElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_BOX_ID;
        document.body.appendChild(div);

        const node1 = document.createElement("div");
        div.appendChild(node1);

        const node2 = document.createElement("div");
        div.appendChild(node2);

        expect(div.children.length).toBe(2);
        execute();
        expect(div.children.length).toBe(0);

        div.remove();
    });
});