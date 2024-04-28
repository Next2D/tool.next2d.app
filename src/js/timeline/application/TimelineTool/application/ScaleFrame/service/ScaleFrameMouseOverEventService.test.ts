import { execute } from "./ScaleFrameMouseOverEventService";

describe("ScaleFrameMouseOverEventServiceTest", () =>
{
    test("execute test", () =>
    {
        const input = document.createElement("input");

        let stopPropagation = false;
        let preventDefault  = false;
        const eventMock = {
            "stopPropagation": () =>
            {
                stopPropagation = true;
            },
            "preventDefault": () => {
                preventDefault = true;
            },
            "target": input
        };

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect(input.style.cursor).toBe("");

        execute(eventMock);

        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect(input.style.cursor).toBe("ew-resize");
    });
});