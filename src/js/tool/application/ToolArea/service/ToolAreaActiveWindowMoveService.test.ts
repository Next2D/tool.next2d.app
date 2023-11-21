import { $TOOL_PREFIX } from "../../../../config/ToolConfig";
import { execute } from "./ToolAreaActiveWindowMoveService";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("ToolAreaActiveWindowMoveServiceTest", () =>
{
    test("execute test", (): Promise<void> =>
    {
        $createWorkSpace();

        const div = document.createElement("div");
        div.id = $TOOL_PREFIX;
        document.body.appendChild(div);

        expect(div.style.left).toBe("");
        expect(div.style.top).toBe("");
        const mockEvent = {
            "stopPropagation": () => { return null },
            "preventDefault": () => { return null },
            "movementX": 20,
            "movementY": 30
        };

        execute(mockEvent);

        return new Promise((reslove) =>
        {
            requestAnimationFrame((): void =>
            {
                expect(div.style.left).toBe("20px");
                expect(div.style.top).toBe("30px");
                div.remove();

                reslove();
            });
        });
    });
});