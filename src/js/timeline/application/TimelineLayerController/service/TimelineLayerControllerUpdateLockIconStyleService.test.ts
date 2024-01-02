import { execute } from "./TimelineLayerControllerUpdateLockIconStyleService";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import { timelineLayer } from "../../../domain/model/TimelineLayer";

describe("TimelineLayerControllerUpdateLockIconStyleServiceTest", () =>
{
    test("execute test", () =>
    {
        const layerElement = document.createElement("div");
        timelineLayer.elements.length = 0;
        timelineLayer.elements.push(layerElement);

        const iconElement = document.createElement("div");
        layerElement.appendChild(iconElement);
        iconElement.setAttribute("class", "timeline-layer-lock-one icon-disable");

        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();

        expect(iconElement.classList.contains("icon-disable")).toBe(true);
        expect(iconElement.classList.contains("icon-active")).toBe(false);

        execute(0, true);

        expect(iconElement.classList.contains("icon-disable")).toBe(false);
        expect(iconElement.classList.contains("icon-active")).toBe(true);

        execute(0, false);

        expect(iconElement.classList.contains("icon-disable")).toBe(true);
        expect(iconElement.classList.contains("icon-active")).toBe(false);
    });
});