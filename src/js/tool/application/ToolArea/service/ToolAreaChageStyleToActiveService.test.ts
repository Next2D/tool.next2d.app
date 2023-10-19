import { execute } from "./ToolAreaChageStyleToActiveService";

describe("ToolAreaChageStyleToActiveServiceTest", () =>
{
    test("execute test", async () =>
    {
        const mockElement = {
            "style": {
                "left": "",
                "top": "",
                "zIndex": "",
                "boxShadow": "",
                "position": ""
            },
            "offsetLeft": 10,
            "offsetTop": 20
        };

        expect(mockElement.style.left).toBe("");
        expect(mockElement.style.top).toBe("");
        expect(mockElement.style.zIndex).toBe("");
        expect(mockElement.style.boxShadow).toBe("");
        expect(mockElement.style.position).toBe("");

        execute(mockElement);
        expect(mockElement.style.left).toBe("10px");
        expect(mockElement.style.top).toBe("20px");
        expect(mockElement.style.zIndex).toBe("16777215");
        expect(mockElement.style.boxShadow).toBe("0 0 5px rgba(245, 245, 245, 0.25)");
        expect(mockElement.style.position).toBe("fixed");
    });
});