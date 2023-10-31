import { $TIMELINE_CONTENT_ID } from "../../../../config/TimelineConfig";
import { Layer } from "../../../../core/domain/model/Layer";
import type { MovieClip } from "../../../../core/domain/model/MovieClip";
import { $getLeftFrame, $getTimelineFrameWidth, timelineHeader, timelineLayer } from "../../TimelineUtil";
import { execute as layerContentControllerComponent } from "../component/LayerContentControllerComponent";
import { execute as layerContentFrameComponent } from "../component/LayerContentFrameComponent";

/**
 * @description 指定のMoiveClipのLayerからタイムラインを生成
 *              Generate a timeline from the specified MoiveClip's Layer
 *
 * @params  {MovieClip} movie_clip
 * @returns {void}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip): void =>
{
    const layers: Layer[] = movie_clip.layers;
    if (!layers.length) {
        return ;
    }

    const parent: HTMLElement | null = document
        .getElementById($TIMELINE_CONTENT_ID);

    if (!parent) {
        return ;
    }

    const frame: number = $getLeftFrame();

    const timelineFrameWidth: number = $getTimelineFrameWidth();
    const elementCount: number = Math.ceil(timelineHeader.clientWidth / (timelineFrameWidth + 1));
    const maxFrame: number = elementCount + 1;

    for (let layerId: number = 0; layerId < layers.length; ++layerId) {

        const layer: Layer = layers[layerId];

        // レイヤーのIDを更新
        layer.id = layerId;

        let element: HTMLElement | null = null;
        if (layerId >= timelineLayer.elements.length) {

            // レイヤーのElementを新規登録
            parent.insertAdjacentHTML("beforeend",
                layerContentControllerComponent(layerId, layer.color));

            element = parent.lastElementChild as HTMLElement;

            const frameControllerElement = element.lastElementChild as NonNullable<HTMLElement>;
            for (let idx: number = 0; idx <= maxFrame; ++idx) {
                frameControllerElement.insertAdjacentHTML("beforeend",
                    layerContentFrameComponent(layerId, frame + idx));
            }

            timelineLayer.elements.push(element);

        } else {

            element = timelineLayer.elements[layerId] as NonNullable<HTMLElement>;

            const frameControllerElement = element.lastElementChild as NonNullable<HTMLElement>;
            const children: HTMLCollection = frameControllerElement.children;

            // 表示フレーム数が多い時はElementを追加
            if (maxFrame > children.length) {
                for (let idx: number = children.length; idx <= maxFrame; ++idx) {
                    frameControllerElement.insertAdjacentHTML("beforeend",
                        layerContentFrameComponent(layerId, frame + idx));
                }
            }

            // 表示
            element.style.display = "";
        }

        if (!element) {
            continue;
        }

        // TODO イベント登録
    }
};