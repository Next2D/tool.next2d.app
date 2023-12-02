import { execute as timelineFrameUpdateFrameElementService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameElementService";
/**
 * @description タイムラインヘッダーのマウスダウンイベント処理関数
 *              Timeline header mouse down event handling function
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    // イベント停止
    event.stopPropagation();
    event.preventDefault();

    const element: HTMLElement | null = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    // マウスで指定したElementのフレームをセット
    const frame: number = parseInt(element.dataset.frame as string);

    // フレームの表示を更新
    timelineFrameUpdateFrameElementService(frame);
};