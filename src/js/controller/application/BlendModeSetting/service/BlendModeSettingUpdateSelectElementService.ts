import type { IBlendMode } from "@/interface/IBlendMode";
import { $BLEND_SELECT_ID } from "@/config/BlendModeConfig";

/**
 * @description ブレンドモードの設定elementを更新する
 *              Update the setting element for blend mode
 *
 * @param {IBlendMode} blend_mode
 * @return {void}
 * @method
 * @public
 */
export const execute = (blend_mode: IBlendMode): void =>
{
    const selectElement = document
        .getElementById($BLEND_SELECT_ID) as HTMLSelectElement | null;

    if (!selectElement) {
        return ;
    }

    selectElement.value = blend_mode;
};