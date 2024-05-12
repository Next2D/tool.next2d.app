import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as timelineHeaderBuildElementUseCase } from "@/timeline/application/TimelineHeader/usecase/TimelineHeaderBuildElementUseCase";
import { execute as stageSettingUpdateFpsHistoryUseCase } from "@/history/application/controller/application/StageSetting/UpdateFPS/usecase/StageSettingUpdateFpsHistoryUseCase";
import { execute as stageSettingUpdateFpsService } from "@/controller/application/StageSetting/service/StageSettingUpdateFpsService";

/**
 * @description ステージのフレームレートを更新
 *              Update the frame rate of the stage
 *
 * @param  {WorkSpace} work_space
 * @param  {number} fps
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    fps: number,
    receiver: boolean = false
): void => {

    const stage = work_space.stage;

    // 変更前の幅をセット
    const beforeFps = stage.fps;

    // 変更がなければ終了
    if (beforeFps === fps) {
        return ;
    }

    // FPSを変更
    stage.fps = fps;

    // 履歴に登録
    stageSettingUpdateFpsHistoryUseCase(
        work_space,
        work_space.scene,
        beforeFps,
        fps,
        receiver
    );

    // アクティブなら表示を更新
    if (work_space.active) {
        // Inputの値を更新
        stageSettingUpdateFpsService(stage.fps);

        // タイムラインのヘッダーを再描画
        timelineHeaderBuildElementUseCase();
    }
};