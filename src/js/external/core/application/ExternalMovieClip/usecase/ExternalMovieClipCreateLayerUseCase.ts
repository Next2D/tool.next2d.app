import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as timelineToolLayerCreateService } from "@/timeline/application/TimelineTool/application/LayerAdd/service/TimelineToolLayerCreateService";
import { execute as timelineToolLayerAddHistoryUseCase } from "@/history/application/timeline/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryUseCase";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as timelineLayerControllerNormalSelectUseCase } from "@/timeline/application/TimelineLayerController/usecase/TimelineLayerControllerNormalSelectUseCase";
import { execute as timelineScrollUpdateHeightService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateHeightService";

/**
 * @description 指定のMovieClipにレイヤーを追加
 *              Add a layer to the specified MovieClip
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {string}  [name = ""]
 * @param  {number}  [index = 0]
 * @param  {string}  [color = ""]
 * @param  {boolean} [receiver = false]
 * @return {Layer}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    name: string = "",
    index: number = -1,
    color: string = "",
    receiver: boolean = false
): Layer | null => {

    // レイヤーを追加
    const newLayer: Layer | null = timelineToolLayerCreateService(
        work_space.id,
        movie_clip.id,
        name,
        index,
        color
    );

    if (!newLayer) {
        return null;
    }

    // 作業履歴を登録
    timelineToolLayerAddHistoryUseCase(work_space, movie_clip, newLayer, receiver);

    // 画面表示されてる、WorkSpaceとMovieClipの場合は表示Elementを更新
    if (work_space.active && movie_clip.active) {
        // タイムラインのyスクロールの高さを更新
        timelineScrollUpdateHeightService();

        // タイムラインを再描画
        timelineLayerBuildElementUseCase();

        // 追加したレイヤーをアクティブ表示にする
        timelineLayerControllerNormalSelectUseCase(newLayer);
    }

    return newLayer;
};