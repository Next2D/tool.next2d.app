import { execute } from "./TimelineLayerUpdateLightService";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";

describe("TimelineLayerUpdateLightServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const layer = workSpace.scene.getLayer(0);

        layer.light = true;
        expect(layer.light).toBe(true);
        execute(layer.id, false);
        expect(layer.light).toBe(false);
        execute(layer.id, true);
        expect(layer.light).toBe(true);
    });
});