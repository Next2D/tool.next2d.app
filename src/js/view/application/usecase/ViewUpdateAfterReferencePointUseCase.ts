import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { IPivotType } from "@/interface/IPivotType";
import { execute as screenReferencePointDeployElementUseCase } from "@/screen/application/ReferencePoint/usecase/ScreenReferencePointDeployElementUseCase";
import { execute as referenceSettingUpdateCellValueService } from "@/controller/application/ReferenceSetting/service/ReferenceSettingUpdateCellValueService";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";

/**
 * @description 変形の中心座標を指定ポイントに設定
 *              Set the transformation center point to the specified coordinates
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {IPivotType} pivot
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    pivot: IPivotType
): void => {

    // ワークスペースとムービークリップがアクティブな場合は表示を更新
    if (!work_space.active || !movie_clip.active) {
        return ;
    }

    referenceSetting.clear();
    referenceSetting.pivot = pivot;

    // セルの表示を更新
    referenceSettingUpdateCellValueService(pivot);

    // 中心点のElementを再配置
    screenReferencePointDeployElementUseCase();
};