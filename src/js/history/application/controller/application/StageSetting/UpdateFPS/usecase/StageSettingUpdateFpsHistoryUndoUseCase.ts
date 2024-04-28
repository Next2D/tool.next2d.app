import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineHeaderBuildElementUseCase } from "@/timeline/application/TimelineHeader/usecase/TimelineHeaderBuildElementUseCase";
import { execute as stageSettingUpdateFpsService } from "@/controller/application/StageSetting/service/StageSettingUpdateFpsService";

/**
 * @description ステージのフレームレートの更新を元に戻す
 *              Revert the update of the frame rate of the stage
 *
 * @param  {number} work_space_id
 * @param  {number} before_fps
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    before_fps: number
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    // 変更前の値に戻す
    const stage = workSpace.stage;
    stage.fps   = before_fps;

    // アクティブなら表示を更新
    if (workSpace.active) {
        // Inputの値を更新
        stageSettingUpdateFpsService(stage.fps);

        // タイムラインのヘッダーを再描画
        timelineHeaderBuildElementUseCase();
    }
};