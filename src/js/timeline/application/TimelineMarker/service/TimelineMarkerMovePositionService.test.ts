import { execute } from "./TimelineMarkerMovePositionService";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("TimelineMarkerMovePositionServiceTest", () =>
{
    test("execute test", () =>
    {
        $createWorkSpace();
        // expect(document.documentElement.style.getPropertyValue("--timeline-scroll-bar-width")).toBe("100px");
        // execute();
        // expect(document.documentElement.style.getPropertyValue("--timeline-scroll-bar-width")).toBe("44px");
    });
});