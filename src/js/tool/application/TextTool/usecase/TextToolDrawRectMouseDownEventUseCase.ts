import { execute as textRectShowService } from "@/screen/application/TextRect/service/TextRectShowService";
import { execute as textToolDrawRectRegisterPointerEventUseCase } from "./TextToolDrawRectRegisterPointerEventUseCase";

/**
 * @description 描画の範囲選択のマウスダウンイベント
 *              Mouse-down event of drawing range selection
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

    // イベントの伝播を停止
    event.stopPropagation();

    // イベントを登録
    textToolDrawRectRegisterPointerEventUseCase(event);

    // 範囲選択のElementを表示
    textRectShowService(event.offsetX, event.offsetY);
};