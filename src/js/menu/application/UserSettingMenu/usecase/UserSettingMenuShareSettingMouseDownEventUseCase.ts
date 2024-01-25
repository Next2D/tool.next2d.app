import { $allHideMenu } from "../../MenuUtil";
import { execute as shareConnectBootUseCase } from "@/share/usecase/ShareConnectBootUseCase";

/**
 * @description 画面共有機能を起動
 *              Activate screen sharing function
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 他のイベントを中止する
    event.stopPropagation();
    event.preventDefault();

    // 全てのメニューを非表示にする
    $allHideMenu();

    // 画面共有機能を起動
    shareConnectBootUseCase();
};