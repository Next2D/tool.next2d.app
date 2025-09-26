import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import { $clamp, $setCursor } from "@/global/GlobalUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as screenReferencePointDeployElementUseCase } from "@/screen/application/ReferencePoint/usecase/ScreenReferencePointDeployElementUseCase";
import { execute as referenceSettingUpdateCellValueService } from "../service/ReferenceSettingUpdateCellValueService";
import { execute as referenceSettingUpdateXUseCase } from "./ReferenceSettingUpdateXUseCase";

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

        const workSpace = $getCurrentWorkSpace();

        // 表示を更新
        const value = parseFloat(element.value);
        const x = $clamp(
            Math.ceil(value + event.movementX / workSpace.scale),
            -Number.MAX_VALUE, Number.MAX_VALUE
        );
        element.value = `${x}`;

        // 中心点を更新
        referenceSettingUpdateXUseCase(workSpace.scene, x);

        // elementの位置を更新
        referenceSetting.movementX += x - value;
        referenceSetting.active = false;
        screenReferencePointDeployElementUseCase();
    });
};