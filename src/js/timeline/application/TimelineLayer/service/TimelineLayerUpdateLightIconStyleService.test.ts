import { execute } from "./TimelineLayerUpdateLightIconStyleService";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("TimelineLayerUpdateLightIconStyleServiceTest", () =>
{
    test("execute test", async () =>
    {
        const layerElement = document.createElement("div");
        document.body.appendChild(layerElement);
        layerElement.id = "layer-id-0";

        const div = document.createElement("div");
        document.body.appendChild(div);
        div.setAttribute("class", "icon-disable");
        div.id = "layer-light-icon-0";

        const span = document.createElement("span");
        div.appendChild(span);

        const workSpace = $createWorkSpace();
        const layer = workSpace.scene.getLayer(0);

        expect(layer.light).toBe(false);
        expect(span.style.display).toBe("");
        expect(layerElement.style.borderBottom).toBe("");

        execute(0, true);

        expect(layer.light).toBe(true);
        expect(span.style.display).toBe("none");
        expect(layerElement.style.borderBottom).toBe(`1px solid ${layer.color}`);

        execute(0, false);

        expect(layer.light).toBe(false);
        expect(span.style.display).toBe("");
        expect(layerElement.style.borderBottom).toBe("");

        div.remove();
        layerElement.remove();
    });
});