import { $TIMELINE_LAYER_DELETE_ID } from "@/config/TimelineConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineToolLayerDeleteUseCase } from "./TimelineToolLayerDeleteUseCase";

/**
 * @description レイヤーの削除ツールのイベント登録
 *              Delete Layer tool event registration
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_LAYER_DELETE_ID);

    if (!element) {
        return ;
    }

    element.addEventListener(EventType.MOUSE_DOWN, (event: PointerEvent): void =>
    {
        if (event.button !== 0) {
            return;
        }

        // 親のイベントを中止する
        event.stopPropagation();
        event.preventDefault();

        // 新規レイヤーを追加
        timelineToolLayerDeleteUseCase();
    });
};