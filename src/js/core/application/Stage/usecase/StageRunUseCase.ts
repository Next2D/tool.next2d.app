import type { Stage } from "@/core/domain/model/Stage";
import { execute as stageStyleUpdateSizeService } from "../service/StageStyleUpdateSizeService";
import { execute as stageStyleUpdateColorService } from "../service/StageStyleUpdateColorService";
import { execute as libraryPreviewAreaChangeColorService } from "@/controller/application/LibraryPreviewArea/service/LibraryPreviewAreaChangeColorService";
import { execute as stageSettingUpdateUseCase } from "@/controller/application/StageSetting/usecase/StageSettingUpdateUseCase";
import { execute as screenStageAreaUpdateSizeService } from "@/screen/application/ScreenStageArea/service/ScreenStageAreaUpdateSizeService";
import { execute as screenStagePositionCenterService } from "@/screen/application/ScreenStage/service/ScreenStagePositionCenterService";
import { execute as screenStageOffsetUpdateService } from "@/screen/application/ScreenStage/service/ScreenStageOffsetUpdateService";

/**
 * @description ステージクラスの初期起動ユースケース
 *              Initial stage class startup use case
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (stage: Stage): void =>
{
    // ステージの幅と高さを設定
    stageStyleUpdateSizeService(stage.width, stage.height);

    // ステージの背景色を設定
    stageStyleUpdateColorService(stage.bgColor);

    // ライブラリのプレビューの背景色を更新
    libraryPreviewAreaChangeColorService(stage.bgColor);

    // ステージ設定の値を更新
    stageSettingUpdateUseCase(stage);

    // ステージ背後のレイヤーを更新
    screenStageAreaUpdateSizeService(stage);

    // ステージを画面中央に配置
    screenStagePositionCenterService(stage);

    // ステージElementのoffset値を更新
    screenStageOffsetUpdateService();
};