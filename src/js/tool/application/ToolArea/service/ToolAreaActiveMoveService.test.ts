import { $TOOL_PREFIX } from "../../../../config/ToolConfig";
import { execute } from "./ToolAreaActiveMoveService";

describe("ToolAreaActiveMoveServiceTest", () =>
{
    test("execute test", async () =>
    {
        const div = document.createElement("div");
        div.id = $TOOL_PREFIX;
        document.body.appendChild(div);

        expect(div.style.left).toBe("");
        expect(div.style.top).toBe("");
        const mockEvent = {
            "stopPropagation": () => { return null },
            "movementX": 20,
            "movementY": 30
        };

        execute(mockEvent);
        expect(div.style.left).toBe("20px");
        expect(div.style.top).toBe("30px");

        div.remove();
    });
});