import { $TRANSFORM_OBJECT_WIDTH_ID } from "@/config/TransformSettingConfig";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $clamp, $setCursor } from "@/global/GlobalUtil";
import { execute as screenDisplayObjectTransformElementService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectTransformElementService";

/**
 * @description 変形エリアの幅の値操作のマウスムーブイベント
 *              Mouse move event for value operation of width of deformation area
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // カーソルを変更
    $setCursor("ew-resize");

    // 移動する量がない場合は終了
    if (!event.movementX) {
        return ;
    }

    requestAnimationFrame((): void =>
    {
        const element: HTMLInputElement | null = document
            .getElementById($TRANSFORM_OBJECT_WIDTH_ID) as HTMLInputElement;

        if (!element) {
            return ;
        }

        // 表示を更新
        const value = parseFloat(parseFloat(element.value).toFixed(2));
        const width = $clamp(value + event.movementX, -Number.MAX_VALUE, Number.MAX_VALUE);
        element.value = `${width}`;

        screenDisplayObjectTransformElementService(width / transformSetting.w);

        transformSetting.w = width;
    });
};