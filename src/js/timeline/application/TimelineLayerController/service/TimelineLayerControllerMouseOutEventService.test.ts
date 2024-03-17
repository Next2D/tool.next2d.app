import { execute } from "./TimelineLayerControllerMouseOutEventService";
import { $setMoveLayerMode } from "../../TimelineUtil";

describe("TimelineLayerControllerMouseOutEventServiceTest", () =>
{
    test("execute test", () =>
    {
        $setMoveLayerMode(true);

        const parent = document.createElement("div");
        parent.classList.add("move-target");

        const div = document.createElement("div");
        parent.appendChild(div);

        let stopPropagation = false;
        const eventMock = {
            "stopPropagation": () =>
            {
                stopPropagation = true;
            },
            "currentTarget": div
        };

        expect(stopPropagation).toBe(false);
        expect(parent.classList.contains("move-target")).toBe(true);
        execute(eventMock);
        expect(stopPropagation).toBe(true);
        expect(parent.classList.contains("move-target")).toBe(false);
    });
});