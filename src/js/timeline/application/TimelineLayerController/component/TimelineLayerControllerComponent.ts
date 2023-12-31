/**
 * @description タイムラインのフレームElementをstringで返却
 *              Return frame Element of the timeline header as string
 *
 * @params {number} index
 * @params {number} layer_id
 * @return {string}
 * @method
 * @public
 */
export const execute = (index: number, layer_id: number): string =>
{
    return `
<div class="timeline-content-child" data-layer-index="${index}" style="display: none;">
    <div class="timeline-layer-controller">
        <i style="display: none;" class="timeline-exit-icon"></i>
        <i style="display: none;" class="timeline-exit-in-icon"></i>
        <i class="timeline-layer-icon" data-detail="{{レイヤー変更(ダブルクリック)}}"></i>
        <i style="display: none;" class="timeline-mask-icon" data-detail="{{レイヤー変更(ダブルクリック)}}"></i>
        <i style="display: none;" class="timeline-mask-in-icon"></i>
        <i style="display: none;" class="timeline-guide-icon" data-detail="{{レイヤー変更(ダブルクリック)}}"></i>
        <i style="display: none;" class="timeline-guide-in-icon" data-detail="{{レイヤー変更(ダブルクリック)}}"></i>
        <div class="view-text" data-layer-index="${index}">Layer_${layer_id}</div>
        <i class="timeline-layer-light-one" data-layer-index="${index}" data-detail="{{レイヤーをハイライト}}"><span style="background-color:#000000;"></span></i>
        <i class="timeline-layer-disable-one icon-disable" data-layer-index="${index}" data-detail="{{レイヤーを非表示}}"></i>
        <i class="timeline-layer-lock-one icon-disable" data-layer-index="${index}" data-detail="{{レイヤーをロック}}"></i>
    </div>

    <div class="timeline-frame-controller"></div>
</div>
`;
};