import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalAlign } from "@/external/controller/domain/model/ExternalAlign";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";
import { $activeTouchPointers } from "@/global/GlobalUtil";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";

/**
 * @description 選択範囲の右端に合わせて選択中のキャラクターを移動
 *              Move the selected character to the right edge of the selection
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

    // 選択範囲の右端に合わせて選択中のキャラクターを移動
    const externalAlign = new ExternalAlign(workSpace, movieClip);
    await externalAlign.right();
};