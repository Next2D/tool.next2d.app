import { execute } from "./TimelineScrollUpdateYPositionService";
import { $TIMELINE_SCROLL_BAR_Y_ID } from "../../../../config/TimelineConfig";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";
import { timelineLayer } from "../../../../timeline/domain/model/TimelineLayer";

describe("TimelineScrollUpdateYPositionServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = $TIMELINE_SCROLL_BAR_Y_ID;
        document.body.appendChild(div);

        $createWorkSpace().scene.scrollY = 100;

        timelineLayer.clientHeight = 200;

        expect(div.style.top).toBe("");
        execute();
        expect(div.style.top).toBe("667px");

        div.remove();
    });
});