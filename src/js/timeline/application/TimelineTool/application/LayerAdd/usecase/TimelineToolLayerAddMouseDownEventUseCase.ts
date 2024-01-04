import { execute as timelineToolLayerAddUseCase } from "./TimelineToolLayerAddUseCase";

/**
 * @description レイヤー追加ボタンのイベント処理関数
 *              Event processing function for the Add Layer button
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return;
    }

    // 親のイベントを中止する
    event.stopPropagation();
    event.preventDefault();

    // 新規レイヤーを追加
    timelineToolLayerAddUseCase();
};