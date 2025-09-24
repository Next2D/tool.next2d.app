import type { IPivotType } from "@/interface/IPivotType";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalReference } from "@/external/controller/domain/model/ExternalReference";
import { $activeTouchPointers } from "@/global/GlobalUtil";

/**
 * @description 中心点エリアのポインターダウンイベント実行ユースケース
 *              Reference Point Area Pointer Down Event Execution Use Case
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    if (event.button !== 0
        || $activeTouchPointers.size > 1
    ) {
        return ;
    }

    // イベント処理を停止
    event.stopPropagation();

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const externalReference = new ExternalReference(workSpace, workSpace.scene);
    await externalReference.setPivot(element.dataset.position as IPivotType);
};