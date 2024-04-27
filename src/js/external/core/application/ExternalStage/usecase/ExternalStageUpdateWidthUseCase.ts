import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as stageChageStyleService  } from "@/core/application/Stage/service/StageChageStyleService";
import { execute as screenStageAreaUpdateSizeService } from "@/screen/application/ScreenStageArea/service/ScreenStageAreaUpdateSizeService";
import { execute as stageSettingUpdateWidthHistoryUseCase } from "@/history/application/controller/application/StageSetting/UpdateWidth/usecase/StageSettingUpdateWidthHistoryUseCase";
import { execute as stageSettingUpdateWidthService } from "@/controller/application/StageSetting/service/StageSettingUpdateWidthService";

/**
 * @description ステージの幅を更新
 *              Update the width of the stage
 *
 * @param  {WorkSpace} work_space
 * @param  {number} width
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    width: number,
    receiver: boolean = false
): void => {

    const stage = work_space.stage;

    // 変更前の幅をセット
    const beforeWidth = stage.width;

    // 変更がなければ終了
    if (beforeWidth === width) {
        return ;
    }

    // 幅を変更
    stage.width = width;

    // 履歴に登録
    stageSettingUpdateWidthHistoryUseCase(
        work_space,
        work_space.scene,
        beforeWidth,
        width,
        receiver
    );

    // アクティブなら表示を更新
    if (work_space.active) {
        // ステージのスタイルを変更
        stageChageStyleService(stage);

        // ステージ背後のレイヤーを更新
        screenStageAreaUpdateSizeService(stage);

        // ステージの幅を更新
        stageSettingUpdateWidthService(width);
    }
};