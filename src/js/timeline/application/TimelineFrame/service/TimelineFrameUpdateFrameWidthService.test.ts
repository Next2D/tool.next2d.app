import { execute } from "./TimelineFrameUpdateFrameWidthService";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import { $TIMELINE_DEFAULT_FRAME_WIDTH_SIZE, $TIMELINE_SCROLL_ID } from "../../../../config/TimelineConfig";
import { describe, expect, it } from "vitest";

describe("TimelineFrameUpdateFrameWidthServiceTest", () =>
{
    it("execute test", (): void =>
    {
        const input = document.createElement("input");
        document.body.appendChild(input);
        input.id = $TIMELINE_SCROLL_ID;
        input.value = "100";

        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const timelineAreaState = workSpace.timelineAreaState;

        document
            .documentElement
            .style
            .setProperty("--timeline-frame-width", `${$TIMELINE_DEFAULT_FRAME_WIDTH_SIZE}px`);

        expect(input.value).toBe("100");
        expect(timelineAreaState.frameWidth).toBe($TIMELINE_DEFAULT_FRAME_WIDTH_SIZE);
        expect(document.documentElement.style.getPropertyValue("--timeline-frame-width"))
            .toBe(`${$TIMELINE_DEFAULT_FRAME_WIDTH_SIZE}px`);

        execute(10);

        expect(input.value).toBe("77");
        expect(timelineAreaState.frameWidth).toBe(10);
        expect(document.documentElement.style.getPropertyValue("--timeline-frame-width")).toBe("10px");

        input.remove();
    });
});