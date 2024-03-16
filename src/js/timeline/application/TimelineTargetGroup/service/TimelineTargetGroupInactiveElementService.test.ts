import { execute } from "./TimelineTargetGroupInactiveElementService";
import { $TIMELINE_TARGET_GROUP_ID } from "../../../../config/TimelineConfig";

describe("TimelineTargetGroupInactiveElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = $TIMELINE_TARGET_GROUP_ID;
        document.body.appendChild(div);

        expect(div.style.display).toBe("");
        execute();
        expect(div.style.display).toBe("none");

        document.body.removeChild(div);
    });
});