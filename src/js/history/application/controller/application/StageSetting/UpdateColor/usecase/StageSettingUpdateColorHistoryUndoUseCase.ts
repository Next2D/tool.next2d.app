import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as stageSettingUpdateColorService } from "@/controller/application/StageSetting/service/StageSettingUpdateColorService";
import { execute as stageStyleUpdateColorService } from "@/core/application/Stage/service/StageStyleUpdateColorService";
import { execute as libraryPreviewAreaChangeColorService } from "@/controller/application/LibraryPreviewArea/service/LibraryPreviewAreaChangeColorService";

/**
 * @description ステージの背景色の更新を元に戻す
 *              Revert the update of the background color of the stage
 *
 * @param  {number} work_space_id
 * @param  {string} before_color
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    before_color: string
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    // 変更前の値に戻す
    const stage   = workSpace.stage;
    stage.bgColor = before_color;

    // アクティブなら表示を更新
    if (workSpace.active) {
        // ライブラリの色を更新
        stageSettingUpdateColorService(stage.bgColor);

        // プレビューエリアの背景色を更新
        libraryPreviewAreaChangeColorService(stage.bgColor);

        // スクリーンのステージのスタイルを変更
        stageStyleUpdateColorService(stage.bgColor);
    }
};