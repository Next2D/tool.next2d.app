import { execute } from "./TimelineLayerUpdateColorService";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";

describe("TimelineLayerUpdateColorServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const layer = workSpace.scene.getLayer(0);

        execute(layer.id, "#ff0000");
        expect(layer.color).toBe("#ff0000");

        execute(layer.id, "#0000ff");
        expect(layer.color).toBe("#0000ff");
    });
});