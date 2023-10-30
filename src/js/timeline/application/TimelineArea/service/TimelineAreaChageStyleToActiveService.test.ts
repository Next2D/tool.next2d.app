import { execute } from "./TimelineAreaChageStyleToActiveService";

describe("TimelineAreaChageStyleToActiveServiceTest", () =>
{
    test("execute test", async () =>
    {
        const mockElement = {
            "style": {
                "width": "",
                "minWidth": "",
                "left": "",
                "top": "",
                "zIndex": "",
                "boxShadow": "",
                "position": ""
            },
            "offsetLeft": 10,
            "offsetTop": 20,
            "clientWidth": 1000
        };

        expect(mockElement.style.width).toBe("");
        expect(mockElement.style.minWidth).toBe("");
        expect(mockElement.style.left).toBe("");
        expect(mockElement.style.top).toBe("");
        expect(mockElement.style.zIndex).toBe("");
        expect(mockElement.style.boxShadow).toBe("");
        expect(mockElement.style.position).toBe("");

        document
            .documentElement
            .style
            .setProperty("--timeline-height", "100px");

        expect(document.documentElement.style.getPropertyValue("--timeline-height")).toBe("100px");

        execute(mockElement);

        expect(mockElement.style.width).toBe("calc(var(--timeline-logic-width) - var(--timeline-layer-controller-width))");
        expect(mockElement.style.minWidth).toBe("860px");
        expect(mockElement.style.left).toBe("10px");
        expect(mockElement.style.top).toBe("20px");
        expect(mockElement.style.zIndex).toBe("16777215");
        expect(mockElement.style.boxShadow).toBe("0 0 5px rgba(245, 245, 245, 0.25)");
        expect(mockElement.style.position).toBe("fixed");
        expect(document.documentElement.style.getPropertyValue("--timeline-height")).toBe("0px");
    });
});