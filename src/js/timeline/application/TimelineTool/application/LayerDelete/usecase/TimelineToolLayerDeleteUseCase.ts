import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description タイムラインの指定レイヤーを削除する
 *              Deleting a specified layer of the timeline
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // アクティブなWorkSpaceを利用する
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // レイヤーが1個しかなければ何もしない
    if (2 > movieClip.layers.length) {
        return ;
    }

    // 選択されたレイヤーがなければ終了
    const selectedLayers = movieClip.selectedLayers;
    if (!selectedLayers.length) {
        return ;
    }

    // 削除するレイヤーのindex配列を作成
    const indexes = [];
    for (let idx = 0; idx < selectedLayers.length; ++idx) {

        const layer = selectedLayers[idx];
        if (!layer) {
            continue;
        }

        // レイヤーのAPIを起動
        const externalLayer = new ExternalLayer(workSpace, movieClip, layer);
        indexes.push(externalLayer.index);
    }

    if (!indexes.length) {
        return ;
    }

    // タイムラインのAPIを起動
    const externalTimeline = new ExternalTimeline(workSpace, movieClip);

    // 削除を実行
    externalTimeline.deleteLayer(indexes);
};