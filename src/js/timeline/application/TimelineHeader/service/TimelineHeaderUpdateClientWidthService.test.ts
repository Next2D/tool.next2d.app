import { execute } from "./TimelineHeaderUpdateClientWidthService";
import { $TIMELINE_CONTROLLER_BASE_ID } from "../../../../config/TimelineConfig";
import { timelineHeader } from "../../../domain/model/TimelineHeader";

describe("TimelineHeaderUpdateClientWidthServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = $TIMELINE_CONTROLLER_BASE_ID;

        timelineHeader.clientWidth = 100;
        expect(timelineHeader.clientWidth).toBe(100);

        execute();

        expect(timelineHeader.clientWidth).toBe(0);
    });
});