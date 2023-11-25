import { execute } from "./TimelineAdjustmentYMouseUpService";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("TimelineAdjustmentYMouseUpServiceTest", () =>
{
    test("execute test", () =>
    {
        let stop = false;
        const eventMock = {
            "stopPropagation": () => {
                stop = true;
            }
        };

        document.documentElement.style.setProperty("--timeline-logic-height", "300px");

        const workSpace = $createWorkSpace();

        expect(stop).toBe(false);
        expect(workSpace.timelineAreaState.height).toBe(270);
        expect(workSpace.timelineAreaState.offsetTop).toBe(0);

        execute(eventMock);

        expect(stop).toBe(true);
        expect(workSpace.timelineAreaState.height).toBe(300);
        expect(workSpace.timelineAreaState.offsetTop).toBe(0);
    });
});