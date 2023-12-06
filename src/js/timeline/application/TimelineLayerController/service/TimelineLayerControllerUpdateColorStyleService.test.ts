import { execute } from "./TimelineLayerControllerUpdateColorStyleService";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("TimelineLayerControllerUpdateColorStyleServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = "layer-light-icon-0";

        const span = document.createElement("span");
        div.appendChild(span);
        span.style.backgroundColor = "#000000";

        const workSpace = $createWorkSpace();
        const layer = workSpace.scene.getLayer(0);

        expect(span.style.backgroundColor).toBe("rgb(0, 0, 0)");
        execute(0, layer.color);

        const bigint = parseInt(`0x${layer.color.slice(1)}`, 16);
        expect(span.style.backgroundColor).toBe(`rgb(${bigint >> 16 & 255}, ${bigint >> 8 & 255}, ${bigint & 255})`);

        div.remove();
    });
});