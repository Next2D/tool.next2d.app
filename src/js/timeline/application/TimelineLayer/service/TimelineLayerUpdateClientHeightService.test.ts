import { timelineLayer } from "../../../domain/model/TimelineLayer";
import { $TIMELINE_CONTENT_ID } from "../../../../config/TimelineConfig";
import { execute } from "./TimelineLayerUpdateClientHeightService";

describe("TimelineLayerUpdateClientHeightServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = $TIMELINE_CONTENT_ID;

        timelineLayer.clientHeight = 100;
        expect(timelineLayer.clientHeight).toBe(100);

        execute();
        expect(timelineLayer.clientHeight).toBe(0);

        div.remove();
    });
});