import { execute } from "./TimelineLayerControllerWindowMouseMoveService";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("TimelineLayerControllerWindowMouseMoveServiceTest", () =>
{
    test("execute test", () =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();

        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "stopPropagation": () =>
            {
                stopPropagation = true;
            },
            "preventDefault": () =>
            {
                preventDefault = true;
            }
        };

        const style = document.documentElement.style;

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect(style.getPropertyValue("--tool-cursor")).toBe("");

        execute(mockEvent);

        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect(style.getPropertyValue("--tool-cursor")).toBe("grabbing");
    });
});