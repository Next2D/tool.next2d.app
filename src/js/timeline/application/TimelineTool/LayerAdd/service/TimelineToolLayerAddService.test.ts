import { execute } from "./TimelineToolLayerAddService";
import { $createWorkSpace } from "../../../../../core/application/CoreUtil";

describe("TTimelineToolLayerAddServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const scene = $createWorkSpace().scene;
        expect(scene.layers.size).toBe(1);

        execute();
        expect(scene.layers.size).toBe(2);
    });
});