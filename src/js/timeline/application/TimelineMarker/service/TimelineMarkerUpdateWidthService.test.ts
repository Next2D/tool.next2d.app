import { execute } from "./TimelineMarkerUpdateWidthService";
import { $TIMELINE_MIN_MARKER_WIDTH_SIZE, $TIMELINE_MAX_MARKER_WIDTH_SIZE } from "../../../../config/TimelineConfig";

describe("TimelineMarkerUpdateWidthServiceTest", () =>
{
    test("execute test", () =>
    {
        document
            .documentElement
            .style
            .setProperty(
                "--marker-width",
                "13px"
            );

        expect(document.documentElement.style.getPropertyValue("--marker-width")).toBe("13px");
        execute(10);
        expect(document.documentElement.style.getPropertyValue("--marker-width")).toBe("10px");
        execute(1);
        expect(document.documentElement.style.getPropertyValue("--marker-width"))
            .toBe(`${$TIMELINE_MIN_MARKER_WIDTH_SIZE}px`);
        execute(99);
        expect(document.documentElement.style.getPropertyValue("--marker-width"))
            .toBe(`${$TIMELINE_MAX_MARKER_WIDTH_SIZE}px`);
    });
});