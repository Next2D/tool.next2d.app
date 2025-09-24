import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { IPivotType } from "@/interface/IPivotType";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as viewUpdateAfterReferencePointUseCase } from "@/view/application/usecase/ViewUpdateAfterReferencePointUseCase";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { ExternalScreen } from "@/external/screen/domain/model/ExternalScreen";

/**
 * @description 中心点を変更前に戻す
 *              Reset the pivot point to its previous state
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @param  {number} keyframe
 * @param  {number} depth
 * @param  {Array<[number, number[]]>} selected_depths
 * @param  {number[]} after_pivot
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    library_id: number,
    index: number,
    keyframe: number,
    depth: number,
    selected_depths: Array<[number, number[]]>,
    after_pivot: IPivotType
): Promise<void> => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip = workSpace.getLibrary(library_id) as MovieClip;
    if (!movieClip) {
        return ;
    }

    const layer = movieClip.getLayer(index);
    if (!layer) {
        return ;
    }

    const character = layer.getCharacter(keyframe, depth);
    if (!character) {
        return ;
    }

    // 選択中のレイヤーを解除して、履歴の選択中のレイヤーに更新
    const externalTimeline = new ExternalTimeline(workSpace, movieClip);
    await externalTimeline.deactivatedAllLayers();

    // 選択中のDisplayObjectを解除して、履歴の選択中のDisplayObjectに更新
    const externalScreen = new ExternalScreen(workSpace, movieClip);
    const values = selected_depths[0];
    await externalScreen.selectDisplayObjects(values[0], values[1]);

    // 指定のpivotに更新
    character.referencePosition.pivot = after_pivot;

    // 表示を更新
    viewUpdateAfterReferencePointUseCase(workSpace, movieClip, after_pivot);
};