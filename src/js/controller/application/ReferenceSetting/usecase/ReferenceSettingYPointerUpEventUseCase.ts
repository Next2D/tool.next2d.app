import { EventType } from "@/tool/domain/event/EventType";
import { execute as referenceSettingYPointerMoveEventUseCase } from "./ReferenceSettingYPointerMoveEventUseCase";
import { ExternalReference } from "@/external/controller/domain/model/ExternalReference";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import {
    $clamp,
    $setCursor
} from "@/global/GlobalUtil";

/**
 * @description 中心点エリアのy座標の値操作のポインタアップイベント
 *              Pointer up event for value operation of y-coordinate of center point area
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    // カーソルを変更
    $setCursor("auto");

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // イベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE,
        referenceSettingYPointerMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);

    const value = parseFloat(element.value);
    const y = $clamp(Math.ceil(value),
        -Number.MAX_VALUE, Number.MAX_VALUE
    );

    if (referenceSetting.beforeY === y) {
        element.focus();
        return ;
    }

    element.value = `${y}`;

    // 移動した量をセット
    referenceSetting.movementY = y - referenceSetting.pivotY;

    // y座標を更新
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    if (movieClip.isSingleSelectedOfDisplayObject()) {
        const layer = movieClip.getLayer(
            movieClip.selectedDepths.keys().next().value as number
        );
        if (!layer) {
            return ;
        }

        const values = movieClip.selectedDepths.values().next().value as number[];
        const character = layer.getCharacter(movieClip.currentFrame, values[0]);
        if (!character) {
            return ;
        }

        // 変更前に戻す
        character.referencePosition.pivot = referenceSetting.pivot;
        character.referencePosition.y = referenceSetting.beforeY;

        // 最終値で更新
        const externalReference = new ExternalReference(workSpace, workSpace.scene);
        await externalReference.setY(y);
    }

    // input要素のフォーカス
    element.focus();
};