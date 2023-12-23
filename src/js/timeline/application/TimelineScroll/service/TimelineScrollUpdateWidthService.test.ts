import { execute } from "./TimelineScrollUpdateWidthService";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";
import { timelineHeader } from "../../../domain/model/TimelineHeader";

describe("TimelineScrollUpdateWidthServiceTest", () =>
{
    test("execute test", () =>
    {
        const scene = $createWorkSpace().scene;

        timelineHeader.clientWidth = 600;

        document
            .documentElement
            .style
            .setProperty(
                "--timeline-scroll-bar-width",
                "100px"
            );

        scene.scrollX = 10000;
        expect(scene.scrollX).toBe(10000);
        expect(document.documentElement.style.getPropertyValue("--timeline-scroll-bar-width")).toBe("100px");
        execute();
        expect(scene.scrollX).toBe(7200);
        expect(document.documentElement.style.getPropertyValue("--timeline-scroll-bar-width")).toBe("44px");

    });
});