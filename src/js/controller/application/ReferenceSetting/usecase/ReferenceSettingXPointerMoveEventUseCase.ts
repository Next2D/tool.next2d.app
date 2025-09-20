import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import { $setCursor } from "@/global/GlobalUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as screenReferencePointDeployElementUseCase } from "@/screen/application/ReferencePoint/usecase/ScreenReferencePointDeployElementUseCase";
import { execute as referenceSettingUpdateCellValueService } from "@/controller/application/ReferenceSetting/service/ReferenceSettingUpdateCellValueService";

/**
 * @description 中心点エリアのx座標のポインタームーブイベント
 *              Pointer move event for x-coordinate of center point area
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // カーソルを変更
    $setCursor("ew-resize");

    // 移動する量がない場合は終了
    if (!event.movementX) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame((): void =>
    {
        const element = event.target as HTMLInputElement;
        if (!element) {
            return ;
        }

        // 表示を更新
        const x = Math.ceil(parseFloat(element.value) + event.movementX);
        element.value = `${x}`;

        // 中心点を更新
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

            if (!character.referencePosition.pivot
                || character.referencePosition.pivot !== "none"
            ) {
                const localPosition = character.referencePosition.getLocalPosition();
                character.referencePosition.y = localPosition.y;

                // fixed logic 最後に固定値を外す
                character.referencePosition.pivot = "none";
                referenceSettingUpdateCellValueService("none");
            }

            character.referencePosition.x = x;
        } else {
            if (referenceSetting.pivot) {
                referenceSetting.pivot = "none";
                referenceSettingUpdateCellValueService("none");
            }
        }

        // elementの位置を更新
        referenceSetting.x = x;
        referenceSetting.active = false;
        screenReferencePointDeployElementUseCase();
    });
};