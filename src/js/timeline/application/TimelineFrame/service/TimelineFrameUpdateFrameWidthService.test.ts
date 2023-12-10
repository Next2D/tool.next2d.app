import { execute } from "./TimelineFrameUpdateFrameWidthService";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";
import { $TIMELINE_DEFAULT_FRAME_WIDTH_SIZE, $TIMELINE_SCROLL_ID } from "../../../../config/TimelineConfig";

describe("TimelineFrameUpdateFrameWidthServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const input = document.createElement("input");
        document.body.appendChild(input);
        input.id = $TIMELINE_SCROLL_ID;
        input.value = "100";

        const timelineAreaState = $createWorkSpace().timelineAreaState;

        document
            .documentElement
            .style
            .setProperty("--timeline-frame-width", `${$TIMELINE_DEFAULT_FRAME_WIDTH_SIZE}px`);

        expect(input.value).toBe("100");
        expect(timelineAreaState.frameWidth).toBe($TIMELINE_DEFAULT_FRAME_WIDTH_SIZE);
        expect(document.documentElement.style.getPropertyValue("--timeline-frame-width"))
            .toBe(`${$TIMELINE_DEFAULT_FRAME_WIDTH_SIZE}px`);

        execute(10);

        expect(input.value).toBe("76");
        expect(timelineAreaState.frameWidth).toBe(10);
        expect(document.documentElement.style.getPropertyValue("--timeline-frame-width")).toBe("10px");

        input.remove();
    });
});