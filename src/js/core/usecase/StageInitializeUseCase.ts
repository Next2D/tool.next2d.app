import type { Stage } from "../model/Stage";
import { execute as stageChageStyleService } from "../service/StageChageStyleService";
import { execute as screenScaleResetService } from "../../screen/application/service/ScreenScaleResetService";
import { execute as libraryPreviewAreaChangeColor } from "../../controller/application/service/LibraryPreviewAreaChangeColor";
import { execute as stageSettingUpdate } from "../../controller/application/service/StageSettingUpdate";
import { execute as timelineLabelNameUpdate } from "../../timeline/application/service/TimelineLabelNameUpdate";
import { execute as screenStageAreaUpdateSize } from "../../screen/application/service/ScreenStageAreaUpdateSize";
import { execute as screenStagePositionCenter } from "../../screen/application/service/ScreenStagePositionCenter";
import { execute as screenStageOffsetUpdate } from "../../screen/application/service/ScreenStageOffsetUpdate";

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
    libraryPreviewAreaChangeColor(stage.bgColor);

    // ステージ設定の値を更新
    stageSettingUpdate(stage);

    // タイムラインのラベルの値を初期化
    timelineLabelNameUpdate("");

    // ステージ背後のレイヤーを更新
    screenStageAreaUpdateSize(stage);

    // ステージを画面中央に配置
    screenStagePositionCenter(stage);

    // ステージElementのoffset値を更新
    screenStageOffsetUpdate();
};