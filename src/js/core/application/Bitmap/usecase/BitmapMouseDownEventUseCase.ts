/**
 * @description スクリーンに設置したBitmapのDisplayObjectのマウスダウンイベント処理関数
 *              Mouse down event processing function of DisplayObject of Bitmap placed on the screen
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

    // 親のイベントをキャンセル
    event.stopPropagation();
    event.preventDefault();

    // 移動用のwindowイベントを登録
};