import { execute } from "./TimelineLayerControllerComponent";
import { describe, expect, it } from "vitest";
import type { Layer } from "../../../../core/domain/model/Layer";

describe("TimelineLayerControllerComponent Test", () =>
{
    it("execute test case2", (): void =>
    {
        const mockLayer = {
            "name": "Layer_1"
        } as unknown as Layer;

        expect(execute(3, mockLayer)).toBe(`
<div class="timeline-content-child" data-layer-index="3" style="display: none;">
    <div class="timeline-layer-controller" data-layer-index="3">
        <i style="display: none;" class="timeline-exit-icon" data-name="exit-icon" data-layer-index="3"></i>
        <i style="display: none;" class="timeline-insert-icon" data-layer-index="3"></i>
        <i class="timeline-layer-icon identification-class" data-layer-index="3" data-detail="{{レイヤー変更(ダブルクリック)}}"></i>
        <div class="view-text identification-view-text" data-layer-index="3">Layer_1</div>
        <i class="timeline-layer-light-one" data-layer-index="3" data-detail="{{レイヤーをハイライト}}"><span style="background-color:#000000;"></span></i>
        <i class="timeline-layer-disable-one icon-disable" data-layer-index="3" data-detail="{{レイヤーを非表示}}"></i>
        <i class="timeline-layer-lock-one icon-disable" data-layer-index="3" data-detail="{{レイヤーをロック}}"></i>
    </div>

    <div class="timeline-frame-controller" data-layer-index="3"></div>
</div>
`);
    });
});