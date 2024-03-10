import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerActiveElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerActiveElementService";
import { execute as timelineLayerInactiveElementService } from "@/timeline/application/TimelineLayer/service/TimelineLayerInactiveElementService";

/**
 * @description レイヤーのShift選択の実行関数
 *              Execute function for Shift-selection of a layer
 *
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    movie_clip: MovieClip,
    layer: Layer
): void => {

    const workSpace = $getCurrentWorkSpace();

    const length = movie_clip.selectedLayers.length;

    // 何も選択してない時は単体選択処理を実行して終了
    if (!length) {
        // 外部APIを起動
        const externalLayer    = new ExternalLayer(workSpace, movie_clip, layer);
        const externalTimeline = new ExternalTimeline(workSpace, movie_clip);

        // 単体選択の外部APIを実行
        return externalTimeline.selectedLayer(
            externalLayer.index,
            movie_clip.currentFrame
        );
    }

    // 最後に選択したアイテムのID
    const lastSelectedLayer = movie_clip.selectedLayers[length - 1];
    if (layer === lastSelectedLayer) {
        return ;
    }

    const firstSelectedLayer = movie_clip.selectedLayers[0];

    // 選択したレイヤーが最初に選択したレイヤーなら単体選択処理を実行して終了
    if (firstSelectedLayer === layer) {
        // 外部APIを起動
        const externalLayer    = new ExternalLayer(workSpace, movie_clip, layer);
        const externalTimeline = new ExternalTimeline(workSpace, movie_clip);

        // 単体選択の外部APIを実行
        return externalTimeline.selectedLayer(
            externalLayer.index,
            movie_clip.currentFrame
        );
    }

    const selectedIndex      = movie_clip.layers.indexOf(layer);
    const firstSelectedIndex = movie_clip.layers.indexOf(firstSelectedLayer);

    if (selectedIndex > firstSelectedIndex) {

        // 上部のレイヤーを未選択に更新
        let targetIndex = firstSelectedIndex - 1;
        while (targetIndex > -1) {

            const targetLayer = movie_clip.layers[targetIndex--];

            const index = movie_clip.selectedLayers.indexOf(targetLayer);

            // 選択中でなければ終了
            if (index === -1) {
                break;
            }

            // 内部情報を更新
            movie_clip.selectedLayers.splice(index, 1);

            const layerElement = timelineLayer.elements[targetLayer.getDisplayIndex()];
            if (!layerElement) {
                continue;
            }

            // 表示されているElementなら非アクティブ表示に更新
            timelineLayerInactiveElementService(layerElement);
        }

        // 最初に選んだレイヤー以降のレイヤーをアクティブに更新
        targetIndex = firstSelectedIndex + 1;
        while (movie_clip.layers.length > targetIndex) {

            const targetLayer = movie_clip.layers[targetIndex++];
            const index = movie_clip.selectedLayers.indexOf(targetLayer);

            if (selectedIndex >= targetIndex - 1) {

                // 選択中ならスキップ
                if (index > -1) {
                    continue;
                }

                // 内部情報を更新
                movie_clip.selectedLayers.push(targetLayer);

                const layerElement = timelineLayer.elements[targetLayer.getDisplayIndex()];
                if (!layerElement) {
                    continue;
                }

                // 表示されているElementならアクティブ表示に更新
                timelineLayerActiveElementService(layerElement);

            } else {

                // 選択中でなければ終了
                if (index === -1) {
                    break;
                }

                // 内部情報を更新
                movie_clip.selectedLayers.splice(index, 1);

                const layerElement = timelineLayer.elements[targetLayer.getDisplayIndex()];
                if (!layerElement) {
                    continue;
                }

                // 表示されているElementなら非アクティブ表示に更新
                timelineLayerInactiveElementService(layerElement);

            }
        }

    } else {

        // 下部のレイヤーを未選択に更新
        let targetIndex = firstSelectedIndex + 1;
        while (movie_clip.layers.length > targetIndex) {

            const targetLayer = movie_clip.layers[targetIndex++];

            const index = movie_clip.selectedLayers.indexOf(targetLayer);

            // 選択中でなければ終了
            if (index === -1) {
                break;
            }

            // 内部情報を更新
            movie_clip.selectedLayers.splice(index, 1);

            const layerElement = timelineLayer.elements[targetLayer.getDisplayIndex()];
            if (!layerElement) {
                continue;
            }

            // 表示されているElementなら非アクティブ表示に更新
            timelineLayerInactiveElementService(layerElement);
        }

        // 最初に選んだレイヤー以前のレイヤーをアクティブに更新
        targetIndex = firstSelectedIndex - 1;
        while (targetIndex > -1) {

            const targetLayer = movie_clip.layers[targetIndex--];
            const index = movie_clip.selectedLayers.indexOf(targetLayer);

            if (selectedIndex <= targetIndex + 1) {

                // 選択中ならスキップ
                if (index > -1) {
                    continue;
                }

                // 内部情報を更新
                movie_clip.selectedLayers.push(targetLayer);

                const layerElement = timelineLayer.elements[targetLayer.getDisplayIndex()];
                if (!layerElement) {
                    continue;
                }

                // 表示されているElementならアクティブ表示に更新
                timelineLayerActiveElementService(layerElement);

            } else {

                // 選択中でなければ終了
                if (index === -1) {
                    break;
                }

                // 内部情報を更新
                movie_clip.selectedLayers.splice(index, 1);

                const layerElement = timelineLayer.elements[targetLayer.getDisplayIndex()];
                if (!layerElement) {
                    continue;
                }

                // 表示されているElementなら非アクティブ表示に更新
                timelineLayerInactiveElementService(layerElement);

            }
        }
    }
};