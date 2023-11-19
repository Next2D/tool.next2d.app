import { EventType } from "@/tool/domain/event/EventType";

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
    element.addEventListener(EventType.MOUSE_DOWN, (event: PointerEvent): void =>
    {
        if (event.button) {
            return ;
        }

        // イベント停止
        event.stopPropagation();

        // TODO
        console.log("TODO:", [event]);
    });

    // アイコンにdrag/dropイベントを登録
    for (let idx = 0; idx < 3; ++idx) {

        const child: HTMLElement | undefined = element.children[1 + idx] as HTMLElement;
        if (!child) {
            continue;
        }

        child.addEventListener("dragover", (event: DragEvent): void =>
        {
            event.preventDefault();
        });

        child.addEventListener("drop", (event: DragEvent): void =>
        {
            // TODO
            console.log("TODO:", [event]);
        });
    }
};