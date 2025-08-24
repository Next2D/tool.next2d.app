import { $setCursor } from "@/global/GlobalUtil";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as transformSettingUpdateRotateToRedrawCanvasUseCase } from "./TransformSettingUpdateRotateToRedrawCanvasUseCase";
import { execute as transformSettingUpdateRotateToElementValuesUseCase } from "./TransformSettingUpdateRotateToElementValuesUseCase";

/**
 * @description 変形エリアの回転の値操作のフォーカスアウトイベント
 *              Focus out event for value operation of rotation of deformation area
 *
 * @param  {FocusEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: FocusEvent): Promise<void> =>
{
    // カーソルを変更
    $setCursor("auto");

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // 入力モードを終了する
    $updateKeyLock(false);

    // 表示を更新
    let rotation = parseInt(element.value) % 360;
    if (0 > rotation) {
        rotation &= 360;
    }

    // elementを更新
    element.value = `${rotation}`;

    const rotate = rotation - transformSetting.rotation;
    transformSettingUpdateRotateToElementValuesUseCase(rotate);
    transformSetting.rotation = rotation;

    // 変形に合わせて表示を更新
    await transformSettingUpdateRotateToRedrawCanvasUseCase();
};