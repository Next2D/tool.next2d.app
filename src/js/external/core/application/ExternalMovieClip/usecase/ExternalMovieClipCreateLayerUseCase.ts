import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as timelineToolLayerCreateService } from "@/timeline/application/TimelineTool/application/LayerAdd/service/TimelineToolLayerCreateService";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as timelineScrollUpdateHeightService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateHeightService";
import { execute as externalTimelineLayerControllerNormalSelectUseCase } from "@/external/timeline/application/ExternalTimelineLayerController/usecase/ExternalTimelineLayerControllerNormalSelectUseCase";

/**
 * @description 指定のMovieClipにレイヤーを追加
 *              Add a layer to the specified MovieClip
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {string}  [name = ""]
 * @param  {number}  [index = 0]
 * @param  {string}  [color = ""]
 * @return {Layer}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    index: number,
    name: string = "",
    color: string = ""
): Layer | null => {

    // レイヤーを追加
    const newLayer: Layer | null = timelineToolLayerCreateService(
        work_space.id,
        movie_clip.id,
        index, name, color
    );

    if (!newLayer) {
        return null;
    }

    // 画面表示されてる、WorkSpaceとMovieClipの場合は表示Elementを更新
    if (work_space.active && movie_clip.active) {
        // タイムラインのyスクロールの高さを更新
        timelineScrollUpdateHeightService();

        // タイムラインを再描画
        timelineLayerBuildElementUseCase();
    }

    return newLayer;
};