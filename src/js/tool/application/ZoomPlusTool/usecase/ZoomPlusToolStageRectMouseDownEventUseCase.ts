import { execute as stageRectShowService } from "@/screen/application/StageRect/service/StageRectShowService";
import { execute as zoomPlusToolStageRectRegisterWindowEventUseCase } from "./ZoomPlusToolStageRectRegisterWindowEventUseCase";

/**
 * @description 拡大の範囲選択のマウスダウンイベントの実行関数
 *              Execution function of the mouse-down event of the range selection of the zoom
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
    zoomPlusToolStageRectRegisterWindowEventUseCase();

    // 範囲選択のElementを表示
    stageRectShowService(event.pageX, event.pageY);
};