import { execute as userToolAreaStateGetService } from "../../../../user/application/service/UserToolAreaStateGetService";
import { execute as toolAreaChageStyleToActiveService } from "../service/ToolAreaChageStyleToActiveService";
import { UserToolAreaStateObjectImpl } from "../../../../interface/UserToolAreaStateObjectImpl";
import { $setToolAreaState } from "../ToolAreaUtil";

/**
 * @description ツールエリアの初期起動時に前回の移動状態をセット
 *              Set previous move state at initial startup of tool area
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // 移動していれば移動位置にElementを移動
    const UserAreaToolState: UserToolAreaStateObjectImpl = userToolAreaStateGetService();
    if (UserAreaToolState.state === "move") {

        // ツールエリアの状態を移動状態に更新
        $setToolAreaState("move");

        // ツールエリアのstyleを移動用に更新
        toolAreaChageStyleToActiveService(element);

        // Elementを移動位置にセット
        element.style.left = `${UserAreaToolState.offsetLeft}px`;
        element.style.top  = `${UserAreaToolState.offsetTop}px`;
    }
};