import type { Layer } from "@/core/domain/model/Layer";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getCurrentWorkSpace, $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as timelineToolLayerAddHistoryUseCase } from "@/history/application/timeline/TimelineTool/LayerAdd/usecase/TimelineToolLayerAddHistoryUseCase";
import { execute as timelineLayerControllerNormalSelectUseCase } from "@/timeline/application/TimelineLayerController/usecase/TimelineLayerControllerNormalSelectUseCase";
import { execute as timelineScrollUpdateHeightService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateHeightService";
import { execute as timelineToolLayerCreateService } from "../service/TimelineToolLayerCreateService";

/**
 * @description タイムラインに新規レイヤーを追加する
 *              Adding a new layer to the timeline
 *
 * @param  {number} [work_space_id = 0]
 * @param  {number} [library_id = -1]
 * @param  {string} [name = ""]
 * @param  {number} [target_index = -1]
 * @param  {string} [color = ""]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number = 0,
    library_id: number = -1,
    name: string = "",
    target_index: number = -1,
    color: string = ""
): void => {

    // 指定がなければ起動中のWorkSpaceを利用する
    const workSpace = work_space_id
        ? $getWorkSpace(work_space_id)
        : $getCurrentWorkSpace();

    if (!workSpace) {
        return ;
    }

    // 指定がなければ、アクティブなMovieClipを利用する
    const scene: InstanceImpl<MovieClip>  = library_id === -1
        ? workSpace.scene
        : workSpace.getLibrary(library_id);

    if (!scene) {
        return ;
    }

    // レイヤーを追加
    const newLayer: Layer | null = timelineToolLayerCreateService(
        workSpace.id,
        scene.id,
        name,
        target_index,
        color
    );

    // 失敗時はここで終了
    if (!newLayer) {
        return ;
    }

    // 作業履歴を登録
    timelineToolLayerAddHistoryUseCase(workSpace, scene, newLayer);

    // 画面表示されてる、WorkSpaceとMovieClipの場合は表示Elementを更新
    // タイムラインのyスクロールの高さを更新
    timelineScrollUpdateHeightService();

    // タイムラインを再描画
    timelineLayerBuildElementUseCase();

    // 追加したレイヤーをアクティブ表示にする
    timelineLayerControllerNormalSelectUseCase(newLayer.id);
};