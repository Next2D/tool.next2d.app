import { execute as drawRectShowService } from "@/screen/application/DrawRect/service/DrawRectShowService";
import { execute as circleToolDrawRectRegisterPointerEventUseCase } from "./CircleToolDrawRectRegisterPointerEventUseCase";

/**
 * @description 円の描画範囲選択のマウスダウンイベントの実行関数
 *              Execution function of the mouse-down event of the drawing range selection of the circle
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
    circleToolDrawRectRegisterPointerEventUseCase(event);

    // 範囲選択のElementを表示
    drawRectShowService(event.offsetX, event.offsetY, "50%");
};