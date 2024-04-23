import { execute } from "./TimelineHeaderScriptIconMouseDownEventService";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";
import { $getMoveIconType, $getMoveIconFrame } from "../../TimelineUtil";
import { $TIMELINE_MARKER_ID } from "../../../../config/TimelineConfig";

describe("TimelineHeaderScriptIconMouseDownEventServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const markerElement = document.createElement("div");
        markerElement.id = $TIMELINE_MARKER_ID;
        markerElement.style.pointerEvents = "";
        document.body.appendChild(markerElement);

        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const movieClip = workSpace.scene;
        movieClip.setAction(4, "test");

        const parent = document.createElement("div");
        parent.dataset.frame = "4";

        const node = document.createElement("div");
        parent.appendChild(node);

        const mockEvent = {
            "currentTarget": node,
            "stopPropagation": () => {}
        };

        expect(movieClip.hasAction(4)).toBe(true);
        expect(node.draggable).toBe(false);
        expect(markerElement.style.pointerEvents).toBe("");

        execute(mockEvent);

        expect(node.draggable).toBe(true);
        expect($getMoveIconType()).toBe("script");
        expect($getMoveIconFrame()).toBe(4);
        expect(markerElement.style.pointerEvents).toBe("none");

        markerElement.remove();
    });
});