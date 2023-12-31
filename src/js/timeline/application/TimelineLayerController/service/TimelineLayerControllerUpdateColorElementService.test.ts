import { execute } from "./TimelineLayerControllerUpdateColorElementService";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import { timelineLayer } from "../../../domain/model/TimelineLayer";

describe("TimelineLayerControllerUpdateColorElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        timelineLayer.elements.length = 0;
        timelineLayer.elements.push(div);

        const i = document.createElement("i");
        i.setAttribute("class", "timeline-layer-light-one");

        const span = document.createElement("span");
        i.appendChild(span);

        div.appendChild(i);
        span.style.backgroundColor = "#000000";

        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const layer = workSpace.scene.getLayer(0);

        expect(span.style.backgroundColor).toBe("rgb(0, 0, 0)");
        execute(0, layer.color);

        const bigint = parseInt(`0x${layer.color.slice(1)}`, 16);
        expect(span.style.backgroundColor).toBe(`rgb(${bigint >> 16 & 255}, ${bigint >> 8 & 255}, ${bigint & 255})`);
    });
});