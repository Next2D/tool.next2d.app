import { execute } from "./TimelineScrollXWindowMoveService";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";
import { timelineHeader } from "../../../../timeline/application/TimelineUtil";

describe("TimelineScrollXWindowMoveServiceTest", () =>
{
    test("execute test", () =>
    {
        let stop = false;
        let preventDefault = false;
        const mockEvent = {
            "stopPropagation": () =>
            {
                stop = true;
            },
            "preventDefault": () =>
            {
                preventDefault = true;
            },
            "movementX": 10
        };

        const scene = $createWorkSpace().scene;
        scene.scrollX = 200;

        timelineHeader.clientWidth = 900;

        expect(stop).toBe(false);
        expect(preventDefault).toBe(false);
        expect(scene.scrollX).toBe(200);
        
        execute(mockEvent);

        expect(stop).toBe(true);
        expect(preventDefault).toBe(true);

        return new Promise((reslove) =>
        {
            setTimeout(() =>
            {
                expect(scene.scrollX).toBe(286);
                reslove();
            }, 100);
        });
        
    });
});