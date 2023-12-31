import { execute } from "./TimelineLayerRegisterLayerAndFrameService";
import { timelineLayer } from "../../../domain/model/TimelineLayer";

describe("TimelineLayerRegisterLayerAndFrameServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const targetLayers = timelineLayer.targetLayers;
        expect(targetLayers.size).toBe(0);

        execute(0, 1);
        expect(targetLayers.size).toBe(1);
        expect(targetLayers.keys().next().value).toBe(0);

        const frames1 = targetLayers.values().next().value as NonNullable<Array<number>>;
        expect(frames1.length).toBe(1);
        expect(frames1[0]).toBe(1);

        // 重複チェック
        execute(0, 1);
        expect(targetLayers.size).toBe(1);
        expect(targetLayers.keys().next().value).toBe(0);

        const frames2 = targetLayers.values().next().value as NonNullable<Array<number>>;
        expect(frames2.length).toBe(1);
        expect(frames2[0]).toBe(1);

        execute(0, 3);
        expect(targetLayers.size).toBe(1);
        expect(targetLayers.keys().next().value).toBe(0);

        const frames3 = targetLayers.values().next().value as NonNullable<Array<number>>;
        expect(frames3.length).toBe(2);
        expect(frames3[0]).toBe(1);
        expect(frames3[1]).toBe(3);

        execute(1, 2);
        expect(targetLayers.size).toBe(2);

        const iterator = targetLayers.values();
        iterator.next();

        const frames4 = iterator.next().value as NonNullable<Array<number>>;
        expect(frames4.length).toBe(1);
        expect(frames4[0]).toBe(2);
    });
});