import { execute } from "./TimelineFrameUpdateFrameHeightService";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("TimelineFrameUpdateFrameHeightServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const timelineAreaState = $createWorkSpace().timelineAreaState;

        document
            .documentElement
            .style
            .setProperty("--timeline-frame-height", "30px");

        expect(timelineAreaState.frameHeight).toBe(30);
        expect(document.documentElement.style.getPropertyValue("--timeline-frame-height")).toBe("30px");

        execute(45);

        expect(timelineAreaState.frameHeight).toBe(45);
        expect(document.documentElement.style.getPropertyValue("--timeline-frame-height")).toBe("45px");
    });
});