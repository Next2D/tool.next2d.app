import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description 指定のレイヤーIDと指定のフレームを選択した状態に更新
 *              Update to selected state with specified layer ID and specified frame
 *
 * @param  {number} layer_id
 * @param  {number} frame
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer_id: number, frame: number): void =>
{
    // レイヤーIDで検索して配列がない場合は初期設定を実行
    const targetLayers = timelineLayer.targetLayers;
    if (!targetLayers.has(layer_id)) {
        targetLayers.set(layer_id, []);
    }

    const frames = targetLayers.get(layer_id) as NonNullable<Array<number>>;

    // 指定のフレーム番号を選択状態に更新
    if (frames.indexOf(frame) === -1) {
        frames.push(frame);
    }
};