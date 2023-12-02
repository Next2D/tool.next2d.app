import { $TIMELINE_CURRENT_FRAME_ID } from "../../../../config/TimelineConfig";
import { execute } from "./TimelineFrameUpdateFrameElementService";

describe("TimelineFrameUpdateFrameElementServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const input = document.createElement("input");
        input.id = $TIMELINE_CURRENT_FRAME_ID;
        input.value = "1";
        document.body.appendChild(input);

        expect(input.value).toBe("1");
        execute(10);
        expect(input.value).toBe("10");
        execute(99);
        expect(input.value).toBe("99");

        input.remove();
    });
});