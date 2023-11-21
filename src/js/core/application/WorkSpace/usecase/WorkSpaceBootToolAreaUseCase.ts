import { $TOOL_PREFIX } from "@/config/ToolConfig";
import { UserToolAreaStateObjectImpl } from "@/interface/UserToolAreaStateObjectImpl";
import { execute as toolAreaChageStyleToActiveService } from "@/tool/application/ToolArea/service/ToolAreaChageStyleToActiveService";
import { execute as toolAreaChageStyleToInactiveService } from "@/tool/application/ToolArea/service/ToolAreaChageStyleToInactiveService";

/**
 * @description WorkSpaceに保存されてるobjectからツールエリアのstyleを更新
 *              Update tool area styles from objects stored in WorkSpace
 *
 * @param  {object} tool_area_state
 * @return {void}
 * @method
 * @public
 */
export const execute = (tool_area_state: UserToolAreaStateObjectImpl): void =>
{
    // ツールエリアを移動していればElementのstyleを更新
    const element: HTMLElement | null = document
        .getElementById($TOOL_PREFIX);

    if (!element) {
        return ;
    }

    // 状態に合わせてstyleを更新
    if (tool_area_state.state === "move") {
        toolAreaChageStyleToActiveService(element);
    } else {
        toolAreaChageStyleToInactiveService(element);
    }
};