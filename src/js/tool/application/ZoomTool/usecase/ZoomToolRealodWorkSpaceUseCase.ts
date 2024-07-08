import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";
import { execute as stageStyleUpdateSizeService } from "@/core/application/Stage/service/StageStyleUpdateSizeService";
import { execute as screenStageAreaUpdateSizeService } from "@/screen/application/ScreenStageArea/service/ScreenStageAreaUpdateSizeService";
import { execute as screenStageOffsetUpdateService } from "@/screen/application/ScreenStage/service/ScreenStageOffsetUpdateService";
import { $SCREEN_ID } from "@/config/ScreenConfig";
import { $getScreenOffsetLeft, $getScreenOffsetTop } from "@/global/GlobalUtil";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import { execute as screenScrollResizeService } from "@/screen/application/ScreenScroll/service/ScreenScrollResizeService";

/**
 * @description ワークスペースをスケール値に合わせて再描画
 *              Redraw the workspace according to the scale value
 *
 * @param  {number} scale
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (scale: number): Promise<void> =>
{
    const workSpace = $getCurrentWorkSpace();
    if (workSpace.scale === scale) {
        return ;
    }

    const beforeScale = workSpace.scale;

    // 対象Element
    const screenElement = document.getElementById($SCREEN_ID);
    if (!screenElement) {
        return ;
    }

    // スクリーンのスクロール位置を計算
    const centerX = screenElement.clientWidth / 2;
    const centerY = screenElement.clientHeight / 2;

    const dx = (screenElement.scrollLeft + centerX - $getScreenOffsetLeft()) / beforeScale * scale;
    const dy = (screenElement.scrollTop  + centerY - $getScreenOffsetTop())  / beforeScale * scale;

    // 内部情報を更新
    workSpace.scale = scale;

    const stage = workSpace.stage;

    // ステージのElementの幅と高さを更新
    stageStyleUpdateSizeService(stage.width, stage.height);

    // スクリーンのステージエリアのサイズを更新
    screenStageAreaUpdateSizeService(stage);

    // ステージElementのoffset値を更新
    screenStageOffsetUpdateService();

    // 選択範囲のElementを更新
    targetRectUpdateElementUseCase();

    // スクリーンのスクロール位置を更新
    screenElement.scrollLeft = $getScreenOffsetLeft() + dx - centerX;
    screenElement.scrollTop  = $getScreenOffsetTop()  + dy - centerY;

    // スクリーンのスクロールバーのサイズを更新
    screenScrollResizeService();

    // スクリーンを再描画
    await screenAreaRedrawUseCase(workSpace.scene);
};