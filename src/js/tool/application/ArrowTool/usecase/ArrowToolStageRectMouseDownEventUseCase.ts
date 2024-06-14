import { execute as stageRectShowService } from "@/screen/application/StageRect/service/StageRectShowService";
import { execute as arrowToolStageRectRegisterPointerEventUseCase } from "./ArrowToolStageRectRegisterPointerEventUseCase";
import { $SCREEN_ID } from "@/config/ScreenConfig";

/**
 * @description 範囲選択のマウスダウンイベントの実行関数
 *              Execution function of the mouse-down event of the range selection
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

    const screenEelement: HTMLElement | null = document
        .getElementById($SCREEN_ID);

    if (!screenEelement) {
        return ;
    }
    screenEelement.style.overflow = "hidden";

    // イベントの伝播を停止
    event.stopPropagation();

    // windowイベントを登録
    arrowToolStageRectRegisterPointerEventUseCase(event);

    // 範囲選択のElementを表示
    stageRectShowService(event.pageX, event.pageY);
};