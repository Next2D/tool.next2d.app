import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $clamp } from "@/global/GlobalUtil";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalReference } from "@/external/controller/domain/model/ExternalReference";
import { execute as viewReferenceSettingUpdatePositionUseCase } from "@/view/application/usecase/ViewReferenceSettingUpdatePositionUseCase";

/**
 * @description 中心点のx座標の入力完了処理
 *              Focus event processing of the center point area x coordinates
 *
 * @param  {FocusEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: FocusEvent): Promise<void> =>
{
    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // 入力モードを終了する
    $updateKeyLock(false);

    const x = $clamp(
        Math.ceil(parseFloat(element.value)),
        -Number.MAX_VALUE, Number.MAX_VALUE
    );

    if (referenceSetting.beforeX === x) {
        return ;
    }

    element.value = `${x}`;

    // 移動した量をセット
    referenceSetting.movementX = x - referenceSetting.beforeX;

    // x座標を更新
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

        // 最終値で更新
        const externalReference = new ExternalReference(workSpace, workSpace.scene);
        await externalReference.setX(x);
    } else {
        referenceSetting.x = x;
        viewReferenceSettingUpdatePositionUseCase(workSpace, workSpace.scene);
    }
};