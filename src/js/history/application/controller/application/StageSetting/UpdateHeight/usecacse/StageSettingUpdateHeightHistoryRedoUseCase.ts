import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as stageChageStyleService } from "@/core/application/Stage/service/StageChageStyleService";
import { execute as screenStageAreaUpdateSizeService } from "@/screen/application/ScreenStageArea/service/ScreenStageAreaUpdateSizeService";
import { execute as stageSettingUpdateHeightService } from "@/controller/application/StageSetting/service/StageSettingUpdateHeightService";

/**
 * @description ステージの高さを更新後に戻す
 *              Revert the stage height after updating
 *
 * @param  {number} work_space_id
 * @param  {number} after_height
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    after_height: number
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    // 変更後の値に戻す
    const stage  = workSpace.stage;
    stage.height = after_height;

    // アクティブなら表示を更新
    if (workSpace.active) {
        // ステージのスタイルを変更
        stageChageStyleService(stage);

        // ステージ背後のレイヤーを更新
        screenStageAreaUpdateSizeService(stage);

        // ステージの高さのInputの値を更新
        stageSettingUpdateHeightService(stage.height);
    }
};