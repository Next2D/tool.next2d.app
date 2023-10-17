import type { Stage } from "../../../domain/model/Stage";
import { execute as stageChageStyleService } from "../service/StageChageStyleService";
import { execute as screenScaleResetService } from "../../../../screen/application/service/ScreenScaleResetService";
import { execute as libraryPreviewAreaChangeColorService } from "../../../../controller/application/LibraryPreviewArea/service/LibraryPreviewAreaChangeColorService";
import { execute as stageSettingUpdateService } from "../../../../controller/application/StageSetting/service/StageSettingUpdateService";
import { execute as timelineLabelNameUpdateService } from "../../../../timeline/application/TimelineLabelName/service/TimelineLabelNameUpdateService";
import { execute as screenStageAreaUpdateSizeService } from "../../../../screen/application/ScreenStageArea/service/ScreenStageAreaUpdateSizeService";
import { execute as screenStagePositionCenterService } from "../../../../screen/application/ScreenStage/service/ScreenStagePositionCenterService";
import { execute as screenStageOffsetUpdateService } from "../../../../screen/application/ScreenStage/service/ScreenStageOffsetUpdateService";

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
    // ステージの幅と高さと背景色を設定
    stageChageStyleService(stage);

    // スクリーンのスケールを初期化
    screenScaleResetService();

    // ライブラリのプレビューの背景色を更新
    libraryPreviewAreaChangeColorService(stage.bgColor);

    // ステージ設定の値を更新
    stageSettingUpdateService(stage);

    // タイムラインのラベルの値を初期化
    timelineLabelNameUpdateService("");

    // ステージ背後のレイヤーを更新
    screenStageAreaUpdateSizeService(stage);

    // ステージを画面中央に配置
    screenStagePositionCenterService(stage);

    // ステージElementのoffset値を更新
    screenStageOffsetUpdateService();
};