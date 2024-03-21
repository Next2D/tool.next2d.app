import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as timelineLayerControllerMoveLayerHistoryUseCase } from "@/history/application/timeline/application/TimelineLayerController/MoveLayer/usecase/TimelineLayerControllerMoveLayerHistoryUseCase";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";

export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    index: number
): void => {

    // MovieClipのレイヤー配列を取得
    const layers = movie_clip.layers;

    // 移動先のレイヤーを取得
    const distLayer = layers[index];

    // 複製して親子関係がないかチェック
    const selectedLayers = movie_clip.selectedLayers.slice();

    for (let idx = 0; idx < selectedLayers.length; idx++) {
        const layer = selectedLayers[idx];
        switch (layer.mode) {

            case 1: // マスクレイヤー
            case 3: // ガイドレイヤー
                // 親レイヤーが含まれていたら処理を終了
                return ;

            default:
                break;

        }
    }

    // 親レイヤーの場合は子のレイヤーを内部的に選択状態にする
    for (let idx = 0; idx < selectedLayers.length; idx++) {

        const layer = selectedLayers[idx];
        switch (layer.mode) {

            case 1: // マスクレイヤー
            case 3: // ガイドレイヤー
                {
                    // selectedLayersは複製配列なので、pushしても表示に影響はない
                    const index = layers.indexOf(layer);
                    for (let idx = index + 1; idx < layers.length; ++idx) {

                        const childLayer = layers[idx];
                        if (childLayer.parentIndex !== index) {
                            break;
                        }

                        if (selectedLayers.indexOf(childLayer) > -1) {
                            continue;
                        }

                        selectedLayers.push(childLayer);
                    }
                }
                break;

            default:
                break;

        }
    }

    // index順に並び替え
    selectedLayers.sort((a: Layer, b: Layer): number =>
    {
        return layers.indexOf(a) - layers.indexOf(b);
    });

    // レイヤーの移動を実行
    for (let idx = 0; idx < selectedLayers.length; idx++) {

        const layer = selectedLayers[idx];

        // 移動前のindex値を取得
        const beforeIndex = layers.indexOf(layer);

        // 配列から削除
        layers.splice(beforeIndex, 1);

        // レイヤーを移動
        const afterIndex = layers.indexOf(distLayer) + idx + 1;

        // 変更がなければスキップ
        if (beforeIndex === afterIndex) {

            // 削除したレイヤーを元のindex値に戻す
            layers.splice(beforeIndex, 0, layer);

            switch (distLayer.mode) {

                case 1: // マスクレイヤー
                    {
                        const externalLayer = new ExternalLayer(work_space, movie_clip, layer);
                        externalLayer.layerType = "mask_in";
                        layer.parentIndex = index;
                    }
                    break;

                case 3: // ガイドレイヤー
                    {
                        const externalLayer = new ExternalLayer(work_space, movie_clip, layer);
                        externalLayer.layerType = "guide_in";
                        layer.parentIndex = index;
                    }
                    break;

                default:
                    continue;

            }

        } else {
            // 指定のindexにレイヤーを移動
            layers.splice(afterIndex, 0, layer);
        }

        // 履歴に登録
        // fixed logic
        timelineLayerControllerMoveLayerHistoryUseCase(
            work_space,
            movie_clip,
            beforeIndex,
            afterIndex
        );
    }

    // タイムラインを再描画
    if (work_space.active && movie_clip.active) {
        timelineLayerBuildElementUseCase();
    }
};