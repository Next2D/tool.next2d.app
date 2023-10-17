import { $TOOL_ARROW_NAME, $TOOL_PREFIX } from "../../../../config/ToolConfig";
import { ArrowTool } from "../../../domain/model/ArrowTool";
import { $getDefaultTool } from "../../Tool";
import { execute } from "./ToolAreaInitializeBootService";

describe("ToolAreaInitializeBootServiceTest", () =>
{
    test("execute test", async () =>
    {
        const before = $getDefaultTool("arrow");
        expect(before).toBe(null);

        const div = document.createElement("div");
        div.id = `${$TOOL_PREFIX}-${$TOOL_ARROW_NAME}`;
        div.dataset.mode = "tool";
        document.body.appendChild(div);

        await execute();

        const after = $getDefaultTool("arrow");
        expect(after instanceof ArrowTool).toBe(true);

        div.remove();
    });
});