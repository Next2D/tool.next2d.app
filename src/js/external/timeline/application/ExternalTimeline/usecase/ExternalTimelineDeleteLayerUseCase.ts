import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as timelineToolLayerDeleteHistoryUseCase } from "@/history/application/timeline/application/TimelineTool/LayerDelete/usecase/TimelineToolLayerDeleteHistoryUseCase";
import { execute as cacheRemoveService } from "@/cache/service/CacheRemoveService";
import { execute as viewTimelineLayerDeleteUseCase } from "@/view/timeline/TimelineLayer/usecase/ViewTimelineLayerDeleteUseCase";
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
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    indexes: number[],
    receiver: boolean = false
): Promise<void> => {

    // 昇順に並び替え
    indexes = indexes.sort((a, b) =>
    {
        return a < b ? -1 : 1;
    });

    // 削除対象のlayerオブジェクトを配列に格納
    const layers = [];
    for (let idx = 0; idx < indexes.length; ++idx) {

        const index = indexes[idx];

        const layer = movie_clip.getLayer(index);
        if (!layer) {
            return ;
        }

        // layerオブジェクトを配列に格納
        layers.push(layer);
    }

    // 削除処理
    let reload = false;
    for (let idx = 0; idx < layers.length; ++idx) {

        // レイヤーが1個しかなければ何もしない
        if (2 > movie_clip.layers.length) {
            break;
        }

        const layer = layers[idx];

        // 削除時点のindex値を取得
        const index = movie_clip.layers.indexOf(layer);

        const indexes = [];
        switch (layer.mode) {

            case $MASK_MODE: // マスクレイヤー
            case $GUIDE_MODE: // ガイドレイヤー
                for (let idx = index + 1; idx < movie_clip.layers.length; ++idx) {

                    const childLayer = movie_clip.getLayer(idx);
                    if (!childLayer || childLayer.parentId !== layer.id) {
                        break;
                    }

                    // 子レイヤーのindexを格納
                    indexes.push(idx);

                    // 初期化
                    childLayer.clearRelation();
                }
                break;

            default:
                break;

        }

        // DisplayObjectがあれば再描画フラグをOnにする
        const activeCharacters = layer.getActiveCharacters(movie_clip.currentFrame);
        if (activeCharacters.length) {
            reload = true;
        }

        // 内部情報から削除
        movie_clip.deleteLayer(layer);

        // 作業履歴に登録
        await timelineToolLayerDeleteHistoryUseCase(
            work_space,
            movie_clip,
            layer, index, indexes, receiver
        );
    }

    // 全ての先祖のキャッシュを削除
    cacheRemoveService(work_space, movie_clip.id);

    // フレーム選択を初期化
    movie_clip.clearSelectedFrame();

    // Viewの表示を更新
    await viewTimelineLayerDeleteUseCase(
        work_space,
        movie_clip,
        reload
    );
};