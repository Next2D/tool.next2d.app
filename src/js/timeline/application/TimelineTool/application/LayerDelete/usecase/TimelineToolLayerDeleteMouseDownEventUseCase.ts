import { execute as timelineToolLayerDeleteUseCase } from "./TimelineToolLayerDeleteUseCase";

/**
 * @description レイヤー削除ボタンのイベント処理関数
 *              Delete Layer button event handling function
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

    // 指定レイヤーを削除
    timelineToolLayerDeleteUseCase();
};