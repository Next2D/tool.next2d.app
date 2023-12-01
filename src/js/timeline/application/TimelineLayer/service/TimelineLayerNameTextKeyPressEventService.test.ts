import { execute } from "./TimelineLayerNameTextKeyPressEventService";

describe("TimelineLayerNameTextKeyPressEventServiceTest", () =>
{
    test("execute test", async () =>
    {
        let stop = false;
        let preventDefault = false;
        let blur = false;
        const meventMock = {
            "key": "Enter",
            "stopPropagation": () =>
            {
                stop = true;
            },
            "preventDefault": () =>
            {
                preventDefault = true;
            },
            "currentTarget": {
                "blur": () =>
                {
                    blur = true;
                }
            }
        };

        expect(stop).toBe(false);
        expect(preventDefault).toBe(false);
        expect(blur).toBe(false);

        execute(meventMock);

        expect(stop).toBe(true);
        expect(preventDefault).toBe(true);
        expect(blur).toBe(true);
    });
});