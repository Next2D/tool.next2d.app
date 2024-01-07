import { EventType } from "@/tool/domain/event/EventType";
import { $TIMELINE_HEADER_SCRIPT_INDEX } from "@/config/TimelineConfig";
import { execute as timelineHeaderMouseDownEventUseCase } from "@/timeline/application/TimelineHeader/usecase/TimelineHeaderMouseDownEventUseCase";
import { execute as timelineHeaderScriptIconMouseDownEventUseCase } from "@/timeline/application/TimelineHeader/usecase/TimelineHeaderScriptIconMouseDownEventUseCase";

/**
 * @description タイムラインのヘッダーフレームにイベント登録を行う
 *              Register events in the header frame of the timeline
 *
 * @params  {HTMLElement} element
 * @returns {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // マウスダウンイベント
    element.addEventListener(EventType.MOUSE_DOWN,
        timelineHeaderMouseDownEventUseCase
    );

    const scriptElement = element.children[$TIMELINE_HEADER_SCRIPT_INDEX] as HTMLElement;
    if (scriptElement) {
        scriptElement.addEventListener(EventType.MOUSE_DOWN,
            timelineHeaderScriptIconMouseDownEventUseCase
        );

        // drop & drag イベント
        scriptElement.addEventListener("dragstart", () => {});
        scriptElement.addEventListener("dragover", () => {});
        scriptElement.addEventListener("dragleave", () => {});
        scriptElement.addEventListener("drop", () => {});
    }

    // アイコンにdrag/dropイベントを登録
    // for (let idx = 0; idx < 3; ++idx) {

    //     const child: HTMLElement | undefined = element.children[1 + idx] as HTMLElement;
    //     if (!child) {
    //         continue;
    //     }

    //     child.addEventListener("dragover", (event: DragEvent): void =>
    //     {
    //         event.preventDefault();
    //     });

    //     child.addEventListener("drop", (event: DragEvent): void =>
    //     {
    //         // TODO
    //         console.log("TODO:", [event]);
    //     });
    // }
};