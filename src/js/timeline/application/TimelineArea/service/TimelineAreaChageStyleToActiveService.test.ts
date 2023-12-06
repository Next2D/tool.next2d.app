import { execute } from "./TimelineAreaChageStyleToActiveService";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("TimelineAreaChageStyleToActiveServiceTest", () =>
{
    test("execute test", () =>
    {
        const workSpace = $createWorkSpace();
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
            "clientWidth": 1000,
            "clientHeight": 300
        };

        workSpace.timelineAreaState.state = "move";
        workSpace.timelineAreaState.offsetTop = 20;
        workSpace.timelineAreaState.offsetLeft = 10;

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

        expect(mockElement.style.width).toBe("var(--timeline-logic-width)");
        expect(mockElement.style.minWidth).toBe("860px");
        expect(mockElement.style.left).toBe("10px");
        expect(mockElement.style.top).toBe("20px");
        expect(mockElement.style.zIndex).toBe("16777215");
        expect(mockElement.style.boxShadow).toBe("0 0 5px rgba(245, 245, 245, 0.25)");
        expect(mockElement.style.position).toBe("fixed");
        expect(document.documentElement.style.getPropertyValue("--timeline-height")).toBe("0px");
    });
});
