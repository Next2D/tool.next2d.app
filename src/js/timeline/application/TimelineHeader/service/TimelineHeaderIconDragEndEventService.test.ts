import { execute } from "./TimelineHeaderIconDragEndEventService";
import { $getMoveIconType, $getMoveIconFrame, $setMoveIconType, $setMoveIconFrame } from "../../TimelineUtil";
import { $TIMELINE_MARKER_ID } from "../../../../config/TimelineConfig";

describe("TimelineHeaderIconDragEndEventServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const markerElement = document.createElement("div");
        markerElement.id = $TIMELINE_MARKER_ID;
        markerElement.style.pointerEvents = "none";
        document.body.appendChild(markerElement);

        const div = document.createElement("div");
        div.draggable = true;

        const mockEvent = {
            "target": div,
            "stopPropagation": () => {},
            "preventDefault": () => {}
        };

        $setMoveIconType("script");
        $setMoveIconFrame(10);

        expect(div.draggable).toBe(true);
        expect($getMoveIconType()).toBe("script");
        expect($getMoveIconFrame()).toBe(10);
        expect(markerElement.style.pointerEvents).toBe("none");

        execute(mockEvent);

        expect(div.draggable).toBe(false);
        expect($getMoveIconType()).toBe("");
        expect($getMoveIconFrame()).toBe(0);
        expect(markerElement.style.pointerEvents).toBe("");

        markerElement.remove();
    });
});