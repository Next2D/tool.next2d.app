import { execute as stageRectShowService } from "@/screen/application/StageRect/service/StageRectShowService";
import { execute as arrowToolStageRectRegisterWindowEventUseCase } from "./ArrowToolStageRectRegisterWindowEventUseCase";

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

    // イベントの伝播を停止
    event.stopPropagation();
    event.preventDefault();

    // windowイベントを登録
    arrowToolStageRectRegisterWindowEventUseCase();

    // 範囲選択のElementを表示
    stageRectShowService(event.pageX, event.pageY);
};