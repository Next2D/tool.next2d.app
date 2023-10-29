import { execute } from "./TimelineAreaChageStyleToInactiveService";

describe("TTimelineAreaChageStyleToInactiveServiceTest", () =>
{
    test("execute test", async () =>
    {
        const mockElement = {
            "style": {
                "width": "1000px",
                "minWidth": "860px",
                "left": "10px",
                "top": "20px",
                "zIndex": "16777215",
                "boxShadow": "0 0 5px rgba(245, 245, 245, 0.25)",
                "position": "fixed"
            },
            "offsetLeft": 10,
            "offsetTop": 20
        };

        expect(mockElement.style.width).toBe("1000px");
        expect(mockElement.style.minWidth).toBe("860px");
        expect(mockElement.style.left).toBe("10px");
        expect(mockElement.style.top).toBe("20px");
        expect(mockElement.style.zIndex).toBe("16777215");
        expect(mockElement.style.boxShadow).toBe("0 0 5px rgba(245, 245, 245, 0.25)");
        expect(mockElement.style.position).toBe("fixed");

        execute(mockElement);
        expect(mockElement.style.width).toBe("");
        expect(mockElement.style.minWidth).toBe("");
        expect(mockElement.style.left).toBe("");
        expect(mockElement.style.top).toBe("");
        expect(mockElement.style.zIndex).toBe("");
        expect(mockElement.style.boxShadow).toBe("");
        expect(mockElement.style.position).toBe("");
    });
});