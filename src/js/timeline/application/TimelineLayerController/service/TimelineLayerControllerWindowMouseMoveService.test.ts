import { execute } from "./TimelineLayerControllerWindowMouseMoveService";

describe("TimelineLayerControllerWindowMouseMoveServiceTest", () =>
{
    test("execute test", () =>
    {
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