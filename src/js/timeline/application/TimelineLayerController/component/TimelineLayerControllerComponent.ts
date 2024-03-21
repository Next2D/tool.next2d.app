import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description タイムラインのフレームElementをstringで返却
 *              Return frame Element of the timeline header as string
 *
 * @params {number} index
 * @params {Layer} layer
 * @return {string}
 * @method
 * @public
 */
export const execute = (index: number, layer: Layer): string =>
{
    return `
<div class="timeline-content-child" data-layer-index="${index}" style="display: none;">
    <div class="timeline-layer-controller" data-layer-index="${index}">
        <i style="display: none;" class="timeline-exit-icon" data-layer-index="${index}"></i>
        <i style="display: none;" class="timeline-exit-in-icon" data-layer-index="${index}"></i>
        <i class="timeline-layer-icon identification-class" data-layer-index="${index}" data-detail="{{レイヤー変更(ダブルクリック)}}"></i>
        <div class="view-text" data-layer-index="${index}">${layer.name}</div>
        <i class="timeline-layer-light-one" data-layer-index="${index}" data-detail="{{レイヤーをハイライト}}"><span style="background-color:#000000;"></span></i>
        <i class="timeline-layer-disable-one icon-disable" data-layer-index="${index}" data-detail="{{レイヤーを非表示}}"></i>
        <i class="timeline-layer-lock-one icon-disable" data-layer-index="${index}" data-detail="{{レイヤーをロック}}"></i>
    </div>

    <div class="timeline-frame-controller" data-layer-index="${index}"></div>
</div>
`;
};