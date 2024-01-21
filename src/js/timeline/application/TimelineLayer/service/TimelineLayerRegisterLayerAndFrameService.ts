import type { Layer } from "@/core/domain/model/Layer";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description 指定のレイヤーIDと指定のフレームを選択した状態に更新
 *              Update to selected state with specified layer ID and specified frame
 *
 * @param  {Layer} layer
 * @param  {number} frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer, frame: number): void =>
{
    // レイヤーIDで検索して配列がない場合は初期設定を実行
    const targetLayers = timelineLayer.targetLayers;
    if (!targetLayers.has(layer)) {
        targetLayers.set(layer, []);
    }

    const frames = targetLayers.get(layer) as NonNullable<Array<number>>;

    // 指定のフレーム番号がなければ配列にセット
    if (frames.indexOf(frame) > -1) {
        return ;
    }

    frames.push(frame);
};