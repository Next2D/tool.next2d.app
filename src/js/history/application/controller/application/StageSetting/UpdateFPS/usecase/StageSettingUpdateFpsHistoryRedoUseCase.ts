import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineHeaderBuildElementUseCase } from "@/timeline/application/TimelineHeader/usecase/TimelineHeaderBuildElementUseCase";
import { execute as stageSettingUpdateFpsService } from "@/controller/application/StageSetting/service/StageSettingUpdateFpsService";

/**
 * @description ステージのフレームレートを更新後に戻す
 *              Revert the update of the frame rate of the stage
 *
 * @param  {number} work_space_id
 * @param  {number} after_fps
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    after_fps: number
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    // 変更後の値に戻す
    const stage = workSpace.stage;
    stage.fps   = after_fps;

    // アクティブなら表示なら、タイムラインのヘッダーを再描画
    if (workSpace.active) {
        // Inputの値を更新
        stageSettingUpdateFpsService(stage.fps);

        // タイムラインのヘッダーを再描画
        timelineHeaderBuildElementUseCase();
    }
};