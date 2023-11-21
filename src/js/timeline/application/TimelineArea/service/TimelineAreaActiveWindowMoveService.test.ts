import { $TIMELINE_ID } from "../../../../config/TimelineConfig";
import { execute } from "./TimelineAreaActiveWindowMoveService";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("TimelineAreaActiveWindowMoveServiceTest", () =>
{
    test("execute test", (): Promise<void> =>
    {
        $createWorkSpace();

        const div = document.createElement("div");
        div.id = $TIMELINE_ID;
        document.body.appendChild(div);

        expect(div.style.left).toBe("");
        expect(div.style.top).toBe("");
        const mockEvent = {
            "stopPropagation": () => { return null },
            "preventDefault": () => { return null },
            "movementX": 20,
            "movementY": 30
        };

        execute(mockEvent);

        return new Promise((reslove) =>
        {
            requestAnimationFrame((): void =>
            {
                expect(div.style.left).toBe("20px");
                expect(div.style.top).toBe("30px");
                div.remove();

                reslove();
            });
        });
    });
});