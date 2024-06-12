import { $TIMELINE_LAYER_CONTROLLER_WIDTH } from "@/config/TimelineConfig";
import { $TOOL_AERA_WIDTH } from "@/config/ToolConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { $getHitElement, $getIconClientY, $getMoveMode, $setMoveMode } from "../../TimelineUtil";
import { execute as timelineScrollUpdateScrollXUseCase } from "@/timeline/application/TimelineScroll/usecase/TimelineScrollUpdateScrollXUseCase";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { execute as timelineHeaderIconMouseOverService } from "../service/TimelineHeaderIconMouseOverService";
import { execute as timelineHeaderIconMouseOutService } from "../service/TimelineHeaderIconMouseOutService";

/**
 * @description タイムラインヘッダーアイコンのウィンドウイベント登録
 *              Window event registration of timeline header icon
 *
 * @param  {PointerEvent} event
 * @param  {boolean} [loop_mode = false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent, loop_mode: boolean = false): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // 全てのメニューを非表示
    $allHideMenu();

    const workSpace = $getCurrentWorkSpace();
    const timelineAreaState = workSpace.timelineAreaState;

    let offsetLeft = timelineAreaState.offsetLeft;
    if (timelineAreaState.state === "fixed") {
        offsetLeft = workSpace.toolAreaState.state === "fixed" ? $TOOL_AERA_WIDTH : 0;
    }

    const frameWidth   = timelineAreaState.frameWidth + 1;
    const baseWidth    = $TIMELINE_LAYER_CONTROLLER_WIDTH + offsetLeft;
    const minPositionX = baseWidth;
    const maxPositionX = timelineHeader.clientWidth + baseWidth;

    // 移動範囲が右側を超えた場合の処理
    if (event.pageX > maxPositionX) {

        requestAnimationFrame(async (): Promise<void> =>
        {
            if (loop_mode && !$getMoveMode()) {
                return ;
            }

            // 右方向に移動
            if (!timelineScrollUpdateScrollXUseCase(frameWidth)) {

                // 自動移動モード終了
                $setMoveMode(false);

                return ;
            }

            if (loop_mode || !$getMoveMode()) {

                // 自動移動モードを開始にセット
                if (!loop_mode) {
                    $setMoveMode(true);
                }

                execute(event, true);
            }
        });

        return ;
    }

    // 移動範囲が左側を超えた場合の処理
    if (event.pageX < minPositionX) {

        requestAnimationFrame(async (): Promise<void> =>
        {
            if (loop_mode && !$getMoveMode()) {
                return ;
            }

            // 左方向に移動
            if (!timelineScrollUpdateScrollXUseCase(-frameWidth)) {

                // 自動移動モード終了
                $setMoveMode(false);

                return ;
            }

            if (loop_mode || !$getMoveMode()) {

                // 自動移動モードを開始にセット
                if (!loop_mode) {
                    $setMoveMode(true);
                }

                execute(event, true);
            }
        });

        return ;
    }

    // 自動移動モード終了
    $setMoveMode(false);

    if (loop_mode) {
        return ;
    }

    requestAnimationFrame((): void =>
    {
        const element = document.elementFromPoint(event.clientX, $getIconClientY()) as HTMLElement;
        if (!element) {
            return ;
        }

        const hitElement = $getHitElement();
        if (hitElement === element) {
            return ;
        }

        // 先に選択していたElementのstyleを初期化
        if (hitElement) {
            timelineHeaderIconMouseOutService(hitElement);
        }

        // マウスオーバーイベントを実行する
        timelineHeaderIconMouseOverService(element);
    });
};