import { execute } from "./TimelineAdjustmentXMouseUpService";

describe("TimelineAdjustmentXMouseUpServiceTest", () =>
{
    test("execute test", () =>
    {
        let stop = false;
        const eventMock = {
            "stopPropagation": () => {
                stop = true;
            }
        };

        expect(stop).toBe(false);
        execute(eventMock);
        expect(stop).toBe(true);
    });
});