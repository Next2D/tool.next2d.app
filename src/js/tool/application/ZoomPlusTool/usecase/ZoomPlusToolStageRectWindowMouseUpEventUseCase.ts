import { EventType } from "@/tool/domain/event/EventType";
import { execute as zoomPlusToolStageRectWindowMouseMoveEventUseCase } from "./ZoomPlusToolStageRectWindowMouseMoveEventUseCase";
import { execute as stageRectHideService } from "@/screen/application/StageRect/service/StageRectHideService";
import { $SCREEN_ID, $SCREEN_STAGE_RECT_ID } from "@/config/ScreenConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as zoomToolUpdateElementService } from "@/tool/application/ZoomTool/service/ZoomToolUpdateElementService";
import { $clamp, $getScreenOffsetLeft, $getScreenOffsetTop } from "@/global/GlobalUtil";
import { execute as stageStyleUpdateSizeService } from "@/core/application/Stage/service/StageStyleUpdateSizeService";
import { execute as screenStageAreaUpdateSizeService } from "@/screen/application/ScreenStageArea/service/ScreenStageAreaUpdateSizeService";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";
import { execute as targetRectMoveElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectMoveElementUseCase";

/**
 * @description 拡大の範囲選択のマウスアップイベントの実行関数
 *              Execution function of the mouse-up event of the range selection of the zoom
 *
 * @param  {PointerEvent} event
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    // イベントの伝播を停止
    event.stopPropagation();
    event.preventDefault();

    // windowイベントを解除
    // window.removeEventListener(EventType.MOUSE_MOVE,
    //     zoomPlusToolStageRectWindowMouseMoveEventUseCase
    // );
    // window.removeEventListener(EventType.MOUSE_UP, execute);

    // 範囲選択のElementを表示
    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_RECT_ID);

    if (!element) {
        stageRectHideService();
        return ;
    }

    const width  = element.clientWidth;
    const height = element.clientHeight;
    if (!width || !height) {
        stageRectHideService();
        return ;
    }

    // 現在の座標を取得
    const left = element.offsetLeft;
    const top  = element.offsetTop;

    // 範囲選択を非表示に
    stageRectHideService();

    const workSpace = $getCurrentWorkSpace();
    const stage = workSpace.stage;

    const beforeScale = workSpace.scale;

    const scale = parseFloat($clamp(Math.max(
        stage.width / width,
        stage.height / height,
        workSpace.scale
    ), 0.25, 5).toFixed(2));

    // 変化がない場合は処理を終了
    if (scale === beforeScale) {
        return ;
    }

    workSpace.scale = scale;

    const screen = document.getElementById($SCREEN_ID);
    if (!screen) {
        return ;
    }

    const centerX = screen.clientWidth  / 2;
    const centerY = screen.clientHeight / 2;

    const dx = (screen.scrollLeft + centerX - $getScreenOffsetLeft()) / beforeScale * workSpace.scale;
    const dy = (screen.scrollTop  + centerY - $getScreenOffsetTop())  / beforeScale * workSpace.scale;

    // スクリーンの表示位置を補正
    screen.scrollLeft = $getScreenOffsetLeft() + dx - centerX;
    screen.scrollTop  = $getScreenOffsetTop()  + dy - centerY;

    // スケールのインプット表示を更新
    zoomToolUpdateElementService(workSpace.scale * 100);

    // スクリーンとステージの表示を更新
    stageStyleUpdateSizeService(stage.width, stage.height);
    screenStageAreaUpdateSizeService(stage);

    // 選択範囲のElementの表示を更新
    targetRectMoveElementUseCase();

    // 再描画
    await screenAreaRedrawUseCase(workSpace.scene);
};