import { execute } from "./ToolAreaChageStyleToActiveService";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import { describe, expect, it } from "vitest";

describe("ToolAreaChageStyleToActiveServiceTest", () =>
{
    it("execute test", () =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();

        const mockElement = {
            "style": {
                "left": "",
                "top": "",
                "zIndex": "",
                "boxShadow": "",
                "position": ""
            }
        } as unknown as HTMLElement;

        workSpace.toolAreaState.state = "move";
        workSpace.toolAreaState.offsetLeft = 10;
        workSpace.toolAreaState.offsetTop = 20;

        expect(mockElement.style.left).toBe("");
        expect(mockElement.style.top).toBe("");
        expect(mockElement.style.zIndex).toBe("");
        expect(mockElement.style.boxShadow).toBe("");
        expect(mockElement.style.position).toBe("");

        execute(mockElement);
        expect(mockElement.style.left).toBe("10px");
        expect(mockElement.style.top).toBe("20px");
        expect(mockElement.style.zIndex).toBe("65535");
        expect(mockElement.style.boxShadow).toBe("0 0 5px rgba(245, 245, 245, 0.25)");
        expect(mockElement.style.position).toBe("fixed");
    });
});