import { execute } from "./TimelineLayerUpdateNameService";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";

describe("TimelineLayerUpdateNameServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const layer = workSpace.scene.getLayer(0);

        expect(layer.name).toBe("Layer_0");
        execute(layer.id, "test");
        expect(layer.name).toBe("test");
    });
});