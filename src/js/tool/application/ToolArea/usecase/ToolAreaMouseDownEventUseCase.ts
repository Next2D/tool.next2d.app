import { $allHide } from "../../../../menu/application/MenuUtil";
import { $setMouseState } from "../../ToolUtil";
import { execute as toolAreaActiveMoveUseCase } from "../usecase/ToolAreaActiveMoveUseCase";

/**
 * @description ツールエリアでマウスダウンした際の関数
 *              Function on mouse down in the tool area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 表示されてるメニューを全て非表示にする
    $allHide();

    // マウスの状態管理をダウンに更新
    $setMouseState("down");

    setTimeout(() =>
    {
        toolAreaActiveMoveUseCase();
    }, 400);
};