import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as stageSettingUpdateColorHistoryUseCase } from "@/history/application/controller/application/StageSetting/UpdateColor/usecase/StageSettingUpdateColorHistoryUseCase";
import { execute as stageSettingUpdateColorService } from "@/controller/application/StageSetting/service/StageSettingUpdateColorService";
import { execute as stageStyleUpdateColorService } from "@/core/application/Stage/service/StageStyleUpdateColorService";
import { execute as libraryPreviewAreaChangeColorService } from "@/controller/application/LibraryPreviewArea/service/LibraryPreviewAreaChangeColorService";

/**
 * @description ステージの背景色を変更
 *              Change the background color of the stage
 *
 * @param  {WorkSpace} work_space
 * @param  {string} color
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    color: string,
    receiver: boolean = false
): void => {

    const stage = work_space.stage;

    // 変更前の幅をセット
    const beforeColor = stage.bgColor;

    // 変更がなければ終了
    if (beforeColor === color) {
        return ;
    }

    // 背景色を変更
    stage.bgColor = color;

    // 履歴に登録
    stageSettingUpdateColorHistoryUseCase(
        work_space,
        work_space.scene,
        beforeColor,
        color,
        receiver
    );

    // アクティブならタイムラインのヘッダーを再描画
    if (work_space.active) {
        // ライブラリの色を更新
        stageSettingUpdateColorService(stage.bgColor);

        // プレビューエリアの背景色を更新
        libraryPreviewAreaChangeColorService(stage.bgColor);

        // スクリーンのステージのスタイルを変更
        stageStyleUpdateColorService(stage.bgColor);
    }
};