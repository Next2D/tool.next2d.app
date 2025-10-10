import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalAlign } from "@/external/controller/domain/model/ExternalAlign";
import { $activeTouchPointers } from "@/global/GlobalUtil";

/**
 * @description ステージの上端に合わせて選択中のキャラクターを移動
 *              Move the selected character to the top edge of the stage
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    // 左クリック以外、またはマルチタッチの場合は処理を行わない
    if (event.button !== 0 || $activeTouchPointers.size > 1) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    if (!movieClip.selectedDepths.size) {
        return ;
    }

    // イベントのバブリングを停止
    event.stopPropagation();

    // ステージの上端に合わせて選択中のキャラクターを移動
    const externalAlign = new ExternalAlign(workSpace, movieClip);
    await externalAlign.stageTop();
};