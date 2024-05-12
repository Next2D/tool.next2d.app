import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as stageStyleUpdateSizeService } from "@/core/application/Stage/service/StageStyleUpdateSizeService";
import { execute as screenStageAreaUpdateSizeService } from "@/screen/application/ScreenStageArea/service/ScreenStageAreaUpdateSizeService";
import { execute as stageSettingUpdateWidthService } from "@/controller/application/StageSetting/service/StageSettingUpdateWidthService";

/**
 * @description ステージの幅を更新後に戻す
 *              Revert the update of the stage width
 *
 * @param  {number} work_space_id
 * @param  {number} after_width
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    after_width: number
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    // 変更後の値に戻す
    const stage = workSpace.stage;
    stage.width = after_width;

    // アクティブなら表示を更新
    if (workSpace.active) {
        // ステージのスタイルを変更
        stageStyleUpdateSizeService(stage.width, 0);

        // ステージ背後のレイヤーを更新
        screenStageAreaUpdateSizeService(stage);

        // ステージ幅のInputの値を更新
        stageSettingUpdateWidthService(stage.width);
    }
};