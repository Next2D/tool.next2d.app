/**
 * @description タイムラインのフレームElementをstringで返却
 *              Return frame Element of the timeline header as string
 *
 * @params {number} layer_id
 * @return {string}
 * @method
 * @public
 */
export const execute = (layer_id: number): string =>
{
    return `
<div class="timeline-content-child" id="layer-id-${layer_id}" data-layer-id="${layer_id}">
    <div class="timeline-layer-controller" data-layer-id="${layer_id}">
        <i style="display: none;" class="timeline-exit-icon" id="timeline-exit-icon-${layer_id}" data-layer-id="${layer_id}"></i>
        <i style="display: none;" class="timeline-exit-in-icon" id="timeline-exit-in-icon-${layer_id}" data-layer-id="${layer_id}"></i>
        <i class="timeline-layer-icon" id="layer-icon-${layer_id}" data-layer-id="${layer_id}" data-detail="{{レイヤー変更(ダブルクリック)}}"></i>
        <i style="display: none;" class="timeline-mask-icon" id="layer-mask-icon-${layer_id}" data-layer-id="${layer_id}" data-detail="{{レイヤー変更(ダブルクリック)}}"></i>
        <i style="display: none;" class="timeline-mask-in-icon" id="layer-mask-in-icon-${layer_id}" data-layer-id="${layer_id}"></i>
        <i style="display: none;" class="timeline-guide-icon" id="layer-guide-icon-${layer_id}" data-layer-id="${layer_id}" data-detail="{{レイヤー変更(ダブルクリック)}}"></i>
        <i style="display: none;" class="timeline-guide-in-icon" id="layer-guide-in-icon-${layer_id}" data-layer-id="${layer_id}" data-detail="{{レイヤー変更(ダブルクリック)}}"></i>
        <div class="view-text" id="layer-name-${layer_id}" data-layer-id="${layer_id}">Layer_${layer_id}</div>
        <i class="timeline-layer-light-one" id="layer-light-icon-${layer_id}" data-layer-id="${layer_id}" data-detail="{{レイヤーをハイライト}}"><span style="background-color:#000000;"></span></i>
        <i class="timeline-layer-disable-one icon-disable" id="layer-disable-icon-${layer_id}" data-click-type="disable" data-layer-id="${layer_id}" data-detail="{{レイヤーを非表示}}"></i>
        <i class="timeline-layer-lock-one icon-disable" id="layer-lock-icon-${layer_id}" data-click-type="lock" data-layer-id="${layer_id}" data-detail="{{レイヤーをロック}}"></i>
    </div>

    <div class="timeline-frame-controller" id="timeline-frame-controller-${layer_id}"></div>
</div>
`;
};