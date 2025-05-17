import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as screenDisplayObjectTransformScaleXElementUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectTransformScaleXElementUseCase";
import {
    $clamp,
    $setCursor
} from "@/global/GlobalUtil";

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
        const value = parseFloat(parseFloat(element.value).toFixed(2));
        const width = $clamp(value + event.movementX, -Number.MAX_VALUE, Number.MAX_VALUE);
        element.value = `${width}`;

        // 変形に合わせて表示を更新
        screenDisplayObjectTransformScaleXElementUseCase(width / transformSetting.w);

        transformSetting.w = width;
    });
};