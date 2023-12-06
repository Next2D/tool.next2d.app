import { execute } from "./TimelineLayerControllerUpdateNameTextStyleService";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("TimelineLayerControllerUpdateNameTextStyleServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = "layer-name-0";
        div.textContent = "Layer_Test";

        const workSpace = $createWorkSpace();
        const layer = workSpace.scene.getLayer(0);
        layer.name = "Layer_Test";

        expect(layer.name).toBe("Layer_Test");
        expect(div.textContent).toBe("Layer_Test");

        execute(0, "test");

        expect(layer.name).toBe("test");
        expect(div.textContent).toBe("test");

        div.remove();
    });
});