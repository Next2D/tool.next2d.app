import { execute } from "./TimelineToolCurrentFrameKeyPressEventService";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../../../core/application/CoreUtil";
import { $TIMELINE_CURRENT_FRAME_ID } from "../../../../../../config/TimelineConfig";

describe("TTimelineToolCurrentFrameKeyPressEventServiceTest", () =>
{
    test("execute test", () =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();

        const input = document.createElement("input");
        document.body.appendChild(input);

        input.id    = $TIMELINE_CURRENT_FRAME_ID;
        input.value = "13";

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
            "key": "Enter",
            "currentTarget": input
        };

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);

        execute(eventMock);

        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);

        input.remove();
    });
});