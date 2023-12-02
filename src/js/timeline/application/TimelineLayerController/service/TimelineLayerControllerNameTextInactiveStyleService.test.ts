import { execute } from "./TimelineLayerControllerNameTextInactiveStyleService";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("TimelineLayerControllerNameTextInactiveStyleServiceTest", () =>
{
    test("execute test", async () =>
    {
        const workSpace = $createWorkSpace();
        const layer = workSpace.scene.getLayer(0);

        const nameElement = document.createElement("div");
        document.body.appendChild(nameElement);

        nameElement.textContent = "test";
        nameElement.id = "layer-name-0";
        nameElement.contentEditable = "true";
        nameElement.style.borderBottom = "1px solid #f5f5f5";

        const div = document.createElement("div");
        div.dataset.layerId = "0";

        const eventMock = {
            "target": div
        };

        expect(layer.name).toBe("Layer_0");
        expect(nameElement.contentEditable).toBe("true");
        expect(nameElement.style.borderBottom).toBe("1px solid #f5f5f5");

        execute(eventMock);

        expect(layer.name).toBe("test");
        expect(nameElement.contentEditable).toBe("false");
        expect(nameElement.style.borderBottom).toBe("");

        nameElement.remove();
    });
});