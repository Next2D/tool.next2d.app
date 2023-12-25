import { execute } from "./TimelineMarkerMovePositionService";
import { $TIMELINE_MARKER_ID, $TIMELINE_MARKER_BORDER_ID } from "../../../../config/TimelineConfig";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";
import { timelineFrame } from "../../../domain/model/TimelineFrame";
import { timelineHeader } from "../../../domain/model/TimelineHeader";

describe("TimelineMarkerMovePositionServiceTest", () =>
{
    test("execute test", () =>
    {
        const scene = $createWorkSpace().scene;
        timelineFrame.currentFrame = 30;
        scene.scrollX = 20;
        timelineHeader.clientWidth = 900;

        const markerElement = document.createElement("div");
        document.body.appendChild(markerElement);
        markerElement.style.left = "100px";
        markerElement.id = $TIMELINE_MARKER_ID;

        const borderElement = document.createElement("div");
        document.body.appendChild(borderElement);
        borderElement.id = $TIMELINE_MARKER_BORDER_ID;

        document
            .documentElement
            .style
            .setProperty(
                "--timeline-marker-border-left",
                "10px"
            );

        expect(markerElement.style.left).toBe("100px");
        expect(document.documentElement.style.getPropertyValue("--timeline-marker-border-left")).toBe("10px");
        execute();

        expect(markerElement.style.left).toBe("378px");
        expect(document.documentElement.style.getPropertyValue("--timeline-marker-border-left")).toBe("377px");

        timelineFrame.currentFrame = 1;
        execute();
        expect(markerElement.style.display).toBe("none");
        expect(borderElement.style.display).toBe("none");

        timelineFrame.currentFrame = 15;
        execute();
        expect(markerElement.style.display).toBe("");
        expect(borderElement.style.display).toBe("");

        markerElement.remove();
        borderElement.remove();
    });
});