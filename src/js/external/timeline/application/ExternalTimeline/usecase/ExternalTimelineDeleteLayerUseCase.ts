import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as timelineToolLayerDeleteHistoryUseCase } from "@/history/application/timeline/application/TimelineTool/LayerDelete/usecase/TimelineToolLayerDeleteHistoryUseCase";
import { execute as externalLayerUpdateReloadUseCase } from "@/external/core/application/ExternalLayer/usecase/ExternalLayerUpdateReloadUseCase";
import {
    $GUIDE_MODE,
    $MASK_MODE
} from "@/config/LayerModeConfig";

/**
 * @description レイヤー削除ユースケース
 *              Layer Delete Use Case
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {array} indexes
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    indexes: number[],
    receiver: boolean = false
): void => {

    // 削除対象のlayerオブジェクトを配列に格納
    const layers = [];
    for (let idx = 0; idx < indexes.length; ++idx) {

        const index = indexes[idx];

        const layer: Layer | undefined = movie_clip.layers[index];
        if (!layer) {
            return ;
        }

        // layerオブジェクトを配列に格納
        layers.push(layer);
    }

    // 削除処理
    for (let idx = 0; idx < layers.length; ++idx) {

        const layer = layers[idx];

        // 削除時点のindex値を取得
        const index = movie_clip.layers.indexOf(layer);

        switch (layer.mode) {

            case $MASK_MODE: // マスクレイヤー
            case $GUIDE_MODE: // ガイドレイヤー
                break;

            default:
                break;

        }

        // 内部情報から削除
        movie_clip.deleteLayer(layer);

        // 作業履歴に登録
        timelineToolLayerDeleteHistoryUseCase(
            work_space,
            movie_clip,
            layer, index, receiver
        );
    }

    // フレーム選択を初期化
    movie_clip.clearSelectedFrame();

    // レイヤー更新によるタイムラインの再描画
    if (work_space.active && movie_clip.active) {
        externalLayerUpdateReloadUseCase();
    }
};