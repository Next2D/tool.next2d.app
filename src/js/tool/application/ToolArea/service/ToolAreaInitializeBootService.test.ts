import { $TOOL_ARROW_NAME, $TOOL_PREFIX } from "../../../../config/ToolConfig";
import { ArrowTool } from "../../../domain/model/ArrowTool";
import { $getDefaultTool } from "../../ToolUtil";
import { execute } from "./ToolAreaInitializeBootService";
import { describe, expect, it } from "vitest";

describe("ToolAreaInitializeBootServiceTest", () =>
{
    it("execute test", async () =>
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