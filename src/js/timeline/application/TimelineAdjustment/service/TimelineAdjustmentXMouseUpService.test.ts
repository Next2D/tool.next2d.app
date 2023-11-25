import { execute } from "./TimelineAdjustmentXMouseUpService";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("TimelineAdjustmentXMouseUpServiceTest", () =>
{
    test("execute test", () =>
    {
        let stop = false;
        const eventMock = {
            "stopPropagation": () => {
                stop = true;
            }
        };

        document.documentElement.style.setProperty("--timeline-logic-width", "800px");

        const workSpace = $createWorkSpace();

        expect(stop).toBe(false);
        expect(workSpace.timelineAreaState.width).toBe(0);

        execute(eventMock);
        
        expect(stop).toBe(true);
        expect(workSpace.timelineAreaState.width).toBe(800);
    });
});