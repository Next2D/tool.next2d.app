import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as stageStyleUpdateSizeService } from "@/core/application/Stage/service/StageStyleUpdateSizeService";
import { execute as screenStageAreaUpdateSizeService } from "@/screen/application/ScreenStageArea/service/ScreenStageAreaUpdateSizeService";
import { execute as stageSettingUpdateHeightHistoryUseCase } from "@/history/application/controller/application/StageSetting/UpdateHeight/usecacse/StageSettingUpdateHeightHistoryUseCase";
import { execute as stageSettingUpdateHeightService } from "@/controller/application/StageSetting/service/StageSettingUpdateHeightService";

/**
 * @description ステージの高さを更新
 *              Update the height of the stage
 *
 * @param  {WorkSpace} work_space
 * @param  {number} height
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    height: number,
    receiver: boolean = false
): void => {

    const stage = work_space.stage;

    // 変更前の幅をセット
    const beforeHeight = stage.height;

    // 変更がなければ終了
    if (beforeHeight === height) {
        return ;
    }

    // 幅を変更
    stage.height = height;

    // 履歴に登録
    stageSettingUpdateHeightHistoryUseCase(
        work_space,
        work_space.scene,
        beforeHeight,
        height,
        receiver
    );

    // アクティブなら表示を更新
    if (work_space.active) {
        // ステージのスタイルを変更
        stageStyleUpdateSizeService(0, stage.height);

        // ステージ背後のレイヤーを更新
        screenStageAreaUpdateSizeService(stage);

        // ステージの高さを更新
        stageSettingUpdateHeightService(stage.height);
    }
};