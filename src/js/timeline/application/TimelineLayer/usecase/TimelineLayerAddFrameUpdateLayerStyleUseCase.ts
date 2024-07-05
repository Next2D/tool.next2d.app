import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerFrameUpdateStyleService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameUpdateStyleService";
import { execute as timelineScrollUpdateWidthService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateWidthService";
import { $getLeftFrame } from "../../TimelineUtil";

/**
 * @description レイヤーにフレームを追加した際にレイヤー表示とスクロール幅を更新
 *              Update layer display and scroll width when adding frames to the layer
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

    // 対象レイヤーのElementを取得、表示範囲にない場合は処理終了
    const layerElement = timelineLayer.elements[layer.getDisplayIndex()] as NonNullable<HTMLElement>;
    if (!layerElement) {
        return ;
    }

    // フレーム側のstyleを更新
    timelineLayerFrameUpdateStyleService(
        movie_clip,
        layerElement.lastElementChild as NonNullable<HTMLElement>,
        $getLeftFrame()
    );

    // xスクロールの幅を更新
    timelineScrollUpdateWidthService();
};