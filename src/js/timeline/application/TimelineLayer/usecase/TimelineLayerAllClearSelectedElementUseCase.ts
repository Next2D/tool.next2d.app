import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getLeftFrame } from "../../TimelineUtil";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description 全てのレイヤーElementのアクティブ情報をリセット、内部情報はここで初期化はしない。
 *              Elementだけの初期化関数
 *              Reset active information of all layer elements, internal information is not initialized here.
 *              Element-only initialization functions
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip): void =>
{
    const leftFrame  = $getLeftFrame();
    const startFrame = movie_clip.selectedStartFrame;
    const endFrame   = movie_clip.selectedEndFrame;

    for (let idx = 0; idx < movie_clip.selectedLayers.length; ++idx) {

        const layer = movie_clip.selectedLayers[idx];

        const layerElement: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
        if (!layerElement) {
            continue ;
        }

        // レイヤーのアクティブ表示を初期化
        if (layerElement.classList.contains("active")) {
            layerElement.classList.remove("active");
        }

        // フレームが未選択の場合は終了
        if (!startFrame) {
            continue ;
        }

        // フレーム側のElementを更新
        const frameElement = layerElement.lastElementChild as NonNullable<HTMLElement>;
        const children = frameElement.children;
        const length   = children.length;
        for (let frame: number = startFrame; endFrame > frame; ++frame) {

            const frameIndex = frame - leftFrame;
            if (frameIndex > length) {
                continue;
            }

            const element: HTMLElement | undefined = children[frameIndex] as HTMLElement;
            if (!element || !element.classList.contains("frame-active")) {
                continue;
            }

            // フレームのアクティブ表示を初期化
            element.classList.remove("frame-active");
        }
    }
};