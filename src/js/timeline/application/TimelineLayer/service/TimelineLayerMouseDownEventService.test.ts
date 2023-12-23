import { execute } from "./TimelineLayerMouseDownEventService";

describe("TimelineLayerMouseDownEventServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const div = document.createElement("div");

        let stopPropagation = false;
        const eventMock = {
            "stopPropagation": () =>
            {
                stopPropagation = true;
            },
            "currentTarget": div
        };

        expect(stopPropagation).toBe(false);
        expect(div.classList.contains("active")).toBe(false);

        execute(eventMock);

        expect(stopPropagation).toBe(true);
        expect(div.classList.contains("active")).toBe(true);
    });
});