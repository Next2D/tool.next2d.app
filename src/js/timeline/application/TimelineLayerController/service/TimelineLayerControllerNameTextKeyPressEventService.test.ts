import { execute } from "./TimelineLayerControllerNameTextKeyPressEventService";
import { describe, expect, it } from "vitest";

describe("TimelineLayerControllerNameTextKeyPressEventServiceTest", () =>
{
    it("execute test", () =>
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
        } as unknown as KeyboardEvent;

        expect(stop).toBe(false);
        expect(preventDefault).toBe(false);
        expect(blur).toBe(false);

        execute(meventMock);

        expect(stop).toBe(true);
        expect(preventDefault).toBe(true);
        expect(blur).toBe(true);
    });
});