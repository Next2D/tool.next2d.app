import { execute } from "./TimelineScrollUpdateXPositionService";
import { $TIMELINE_SCROLL_BAR_X_ID } from "../../../../config/TimelineConfig";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";
import { timelineHeader } from "../../../../timeline/application/TimelineUtil";

describe("TimelineScrollUpdateXPositionServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = $TIMELINE_SCROLL_BAR_X_ID;
        document.body.appendChild(div);

        $createWorkSpace().scene.scrollX = 200;

        timelineHeader.clientWidth = 900;

        expect(div.style.left).toBe("");
        execute();
        expect(div.style.left).toBe("24px");

        div.remove();
    });
});