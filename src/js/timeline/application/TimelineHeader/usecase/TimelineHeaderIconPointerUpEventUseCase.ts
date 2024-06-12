import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineHeaderIconPointerMoveEventUseCase } from "./TimelineHeaderIconPointerMoveEventUseCase";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { execute as timelineHeaderScriptIconMoveUseCase } from "./TimelineHeaderScriptIconMoveUseCase";
import { execute as timelineHeaderLabelIconMoveUseCase } from "./TimelineHeaderLabelIconMoveUseCase";
import { execute as timelineHeaderSoundIconMoveUseCase } from "./TimelineHeaderSoundIconMoveUseCase";
import {
    $TIMELINE_HEADER_LABEL_INDEX,
    $TIMELINE_HEADER_SCRIPT_INDEX,
    $TIMELINE_HEADER_SOUND_INDEX,
    $TIMELINE_MARKER_ID
} from "@/config/TimelineConfig";
import {
    $getDestIconFrame,
    $getLeftFrame,
    $getMoveIconFrame,
    $getMoveIconType,
    $setDestIconFrame,
    $setMoveIconFrame,
    $setMoveIconType
} from "../../TimelineUtil";

/**
 * @description タイムラインヘッダーアイコンのウィンドウアップイベントの実行関数
 *              Execution function of the window up event of the timeline header icon
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // イベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.MOUSE_MOVE, timelineHeaderIconPointerMoveEventUseCase);
    element.removeEventListener(EventType.MOUSE_UP, execute);

    // 移動変数をセット
    const sourceFrame  = $getMoveIconFrame();
    const destFrame    = $getDestIconFrame();
    const moveIconType = $getMoveIconType();

    // 移動変数を初期化
    $setMoveIconType("");
    $setMoveIconFrame(0);
    $setDestIconFrame(0);

    // マーカーのイベントを無効化を解除
    const markerElement: HTMLElement | null = document
        .getElementById($TIMELINE_MARKER_ID);

    if (!markerElement) {
        return ;
    }

    // イベントを有効か
    markerElement.style.pointerEvents = "";

    switch (moveIconType) {

        case "script":
            {
                const element = timelineHeader.elements[destFrame - $getLeftFrame()] as HTMLElement;
                if (element) {
                    const node = element.children[$TIMELINE_HEADER_SCRIPT_INDEX] as HTMLElement;
                    if (!node) {
                        return ;
                    }
                    node.style.backgroundColor = "";
                }

                if (sourceFrame !== destFrame) {
                    timelineHeaderScriptIconMoveUseCase(
                        sourceFrame, destFrame, event.altKey
                    );
                }
            }
            break;

        case "label":
            {
                const element = timelineHeader.elements[destFrame - $getLeftFrame()] as HTMLElement;
                if (element) {
                    const node = element.children[$TIMELINE_HEADER_LABEL_INDEX] as HTMLElement;
                    if (!node) {
                        return ;
                    }
                    node.style.backgroundColor = "";
                }

                if (sourceFrame !== destFrame) {
                    timelineHeaderLabelIconMoveUseCase(
                        sourceFrame, destFrame, event.altKey
                    );
                }
            }
            break;

        case "sound":
            {
                const element = timelineHeader.elements[destFrame - $getLeftFrame()] as HTMLElement;
                if (element) {
                    const node = element.children[$TIMELINE_HEADER_SOUND_INDEX] as HTMLElement;
                    if (!node) {
                        return ;
                    }
                    node.style.backgroundColor = "";
                }

                if (sourceFrame !== destFrame) {
                    timelineHeaderSoundIconMoveUseCase(
                        sourceFrame, destFrame, event.altKey
                    );
                }
            }
            break;

    }
};