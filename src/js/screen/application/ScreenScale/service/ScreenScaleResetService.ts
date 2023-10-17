import { $SCREEN_SCALE_ID } from "../../../../config/ToolConfig";
import { $setZoom } from "../../../../util/Global";

/**
 * @description ステージのスケール情報をリセット
 *              Reset stage scale information
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 内部データを初期化
    $setZoom(1);

    // 表示Elementを初期化
    const element: HTMLInputElement | null = document
        .getElementById($SCREEN_SCALE_ID) as HTMLInputElement;

    if (!element) {
        return ;
    }

    element.value = "100";
};