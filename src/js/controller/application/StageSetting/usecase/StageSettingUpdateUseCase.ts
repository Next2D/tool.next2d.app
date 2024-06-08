import type { Stage } from "@/core/domain/model/Stage";
import { execute as stageSettingUpdateWidthService } from "../service/StageSettingUpdateWidthService";
import { execute as stageSettingUpdateHeightService } from "../service/StageSettingUpdateHeightService";
import { execute as stageSettingUpdateFpsService } from "../service/StageSettingUpdateFpsService";
import { execute as stageSettingUpdateColorService } from "../service/StageSettingUpdateColorService";

/**
 * @description ステージ設定の各値を更新
 *              Update each value of stage setting
 *
 * @param  {Stage} stage
 * @return {void}
 * @method
 * @public
 */
export const execute = (stage: Stage): void =>
{
    // ステージ幅のInputの値を更新
    stageSettingUpdateWidthService(stage.width);

    // ステージ高さのInputの値を更新
    stageSettingUpdateHeightService(stage.height);

    // ステージFPSのInputの値を更新
    stageSettingUpdateFpsService(stage.fps);

    // スクリーンのステージのスタイルを変更
    stageSettingUpdateColorService(stage.bgColor);
};