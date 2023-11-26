import { UserControllerAreaStateObjectImpl } from "@/interface/UserControllerAreaStateObjectImpl";

/**
 * @description WorkSpaceに保存されてるobjectからコントローラーエリアのstyleを更新
 *              Update controller area styles from objects stored in WorkSpace
 *
 * @param  {object} controller_area_state
 * @return {void}
 * @method
 * @public
 */
export const execute = (controller_area_state: UserControllerAreaStateObjectImpl): void =>
{
    // コントローラーの幅をセット
    document
        .documentElement
        .style
        .setProperty("--controller-width", `${controller_area_state.width}px`);
};