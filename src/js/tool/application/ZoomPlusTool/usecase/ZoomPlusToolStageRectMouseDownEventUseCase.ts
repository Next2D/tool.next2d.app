import { execute as stageRectShowService } from "@/screen/application/StageRect/service/StageRectShowService";
import { execute as zoomPlusToolStageRectRegisterPointerEventUseCase } from "./ZoomPlusToolStageRectRegisterPointerEventUseCase";

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

    // イベントを登録
    zoomPlusToolStageRectRegisterPointerEventUseCase(event);

    // 範囲選択のElementを表示
    stageRectShowService(event.offsetX, event.offsetY);
};