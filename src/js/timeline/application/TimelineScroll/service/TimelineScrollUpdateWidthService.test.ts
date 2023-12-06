import { execute } from "./TimelineScrollUpdateWidthService";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";
import { timelineHeader } from "../../../../timeline/application/TimelineUtil";

describe("TimelineScrollUpdateWidthServiceTest", () =>
{
    test("execute test", () =>
    {
        $createWorkSpace();

        timelineHeader.clientWidth = 600;

        document
            .documentElement
            .style
            .setProperty(
                "--timeline-scroll-bar-width",
                "100px"
            );

        expect(document.documentElement.style.getPropertyValue("--timeline-scroll-bar-width")).toBe("100px");
        execute();
        expect(document.documentElement.style.getPropertyValue("--timeline-scroll-bar-width")).toBe("44px");

    });
});