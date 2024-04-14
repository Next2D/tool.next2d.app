import { execute as timelineToolLayerDeleteUseCase } from "./TimelineToolLayerDeleteUseCase";

/**
 * @description レイヤー削除ボタンのイベント処理関数
 *              Delete Layer button event handling function
 *
 * @param  {PointerEvent} event
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    if (event.button !== 0) {
        return;
    }

    // 親のイベントを中止する
    event.stopPropagation();
    event.preventDefault();

    // 指定レイヤーを削除
    await timelineToolLayerDeleteUseCase();
};