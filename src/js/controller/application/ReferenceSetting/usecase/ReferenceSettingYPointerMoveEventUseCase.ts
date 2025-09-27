import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import { $clamp, $setCursor } from "@/global/GlobalUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as screenReferencePointDeployElementUseCase } from "@/screen/application/ReferencePoint/usecase/ScreenReferencePointDeployElementUseCase";
import { execute as referenceSettingUpdateYUseCase } from "./ReferenceSettingUpdateYUseCase";

/**
 * @description 中心点エリアのy座標のポインタームーブイベント
 *              Pointer move event for y-coordinate of center point area
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

        const workSpace = $getCurrentWorkSpace();

        // 表示を更新
        const value = parseFloat(element.value);
        const y = $clamp(
            Math.ceil(value + event.movementX * workSpace.scale),
            -Number.MAX_VALUE, Number.MAX_VALUE
        );
        element.value = `${y}`;

        // 中心点を更新
        referenceSettingUpdateYUseCase(workSpace.scene, y);

        // elementの移動量を更新
        referenceSetting.movementY = y - referenceSetting.pivotY;
        screenReferencePointDeployElementUseCase();
    });
};