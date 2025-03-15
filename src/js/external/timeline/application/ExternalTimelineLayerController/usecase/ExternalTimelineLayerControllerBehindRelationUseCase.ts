import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { ILayerMode } from "@/interface/ILayerMode";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as timelineLayerControllerMoveLayerHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerController/MoveLayer/usecase/TimelineLayerControllerMoveLayerHistoryUseCase";
import { execute as timelineLayerControllerUpdateIconElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateIconElementService";
import { execute as screenAreaUpdateMovedLayerService } from "@/screen/application/ScreenArea/service/ScreenAreaUpdateMovedLayerService";
import { execute as screenDisplayObjectUpdateLayerMaskInElementUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectUpdateLayerMaskInElementUseCase";
import {
    $GUIDE_IN_MODE,
    $GUIDE_MODE,
    $MASK_IN_MODE,
    $MASK_MODE
} from "@/config/LayerModeConfig";

/**
 * @description マスク、ガイドレイヤーの親子関係を考慮してレイヤーを移動
 *              Move the layer considering the parent-child relationship of the mask and guide layers
 *
 * @param {WorkSpace} work_space
 * @param {MovieClip} movie_clip
 * @param {number} index
 * @return {void}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    index: number
): Promise<void> => {

    // 移動先のレイヤーを取得
    const distLayer = movie_clip.getLayer(index);
    if (!distLayer) {
        return ;
    }

    // 複製して親子関係がないかチェック
    const selectedLayers = movie_clip.getCloneAndSortSelectedLayers();

    // 移動するレイヤーの中に、親レイヤーが含まれていたら処理を終了
    for (let idx = 0; idx < selectedLayers.length; idx++) {
        const layer = selectedLayers[idx];
        switch (layer.mode) {

            case $MASK_MODE: // マスクレイヤー
            case $GUIDE_MODE: // ガイドレイヤー
                return ;

            default:
                break;

        }
    }

    let mode: ILayerMode = 0;
    switch (distLayer.mode) {

        case $MASK_MODE: // マスクレイヤー
        case $MASK_IN_MODE: // マスクの子レイヤー
            mode = 2;
            break;

        case $GUIDE_MODE: // ガイドレイヤー
        case $GUIDE_IN_MODE: // ガイドの子レイヤー
            mode = 4;
            break;

        default:
            break;

    }

    const parentId = distLayer.parentId === -1
        ? distLayer.id
        : distLayer.parentId;

    // MovieClipのレイヤー配列を取得
    const layers = movie_clip.layers;

    const parentLayer = movie_clip.getLayerById(parentId);
    if (!parentLayer) {
        return ;
    }

    // レイヤーの移動を実行
    for (let idx = 0; idx < selectedLayers.length; idx++) {

        const layer = selectedLayers[idx];

        // 移動前のindex値を取得
        const beforeIndex = layers.indexOf(layer);

        // 配列から削除
        layers.splice(beforeIndex, 1);

        // レイヤーを移動
        const afterIndex = layers.indexOf(distLayer) + idx + 1;

        // 移動先が移動元と同じ場合は親レイヤーの中に移動する
        if (beforeIndex === afterIndex) {
            // 削除したレイヤーを元のindex値に戻す
            layers.splice(beforeIndex, 0, layer);

            // お互いに子レイヤーならスキップ
            if (layer.mode === distLayer.mode) {
                continue;
            }

            // 移動先が一緒で、親子関係がある場合はスキップ
            if (layer.parentId === parentId) {
                continue;
            }
        } else {
            // 指定のindexにレイヤーを移動
            layers.splice(afterIndex, 0, layer);
        }

        // マスクレイヤーへの移動で、新規の子レイヤーの場合はstyleを更新
        const maskReload = mode === 2 && layer.parentId !== parentId;

        // 変更前のレイヤー情報を取得
        const beforeMode     = layer.mode;
        const beforeParentId = layer.parentId;

        // 親子関係を設定
        layer.mode     = mode;
        layer.parentId = parentId;

        // 履歴に登録
        // fixed logic
        await timelineLayerControllerMoveLayerHistoryUseCase(
            work_space,
            movie_clip,
            layer,
            beforeIndex,
            afterIndex,
            beforeMode,
            beforeParentId
        );

        if (work_space.active && movie_clip.active) {
            // アクティブならアイコン表示を更新
            await timelineLayerControllerUpdateIconElementService(layer);

            // スクリーンのElementの階層を更新
            screenAreaUpdateMovedLayerService(layer);

            if (maskReload) {
                await screenDisplayObjectUpdateLayerMaskInElementUseCase(movie_clip, layer);
            }
        }
    }

    // タイムラインを再描画
    if (work_space.active && movie_clip.active) {
        // タイムラインのelementを再構築
        timelineLayerBuildElementUseCase();
    }
};