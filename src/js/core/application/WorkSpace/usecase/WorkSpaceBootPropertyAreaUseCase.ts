import { UserPropertyAreaStateObjectImpl } from "@/interface/UserPropertyAreaStateObjectImpl";

/**
 * @description WorkSpaceに保存されてるobjectからコントロールエリアのstyleを更新
 *              Update control area styles from objects stored in WorkSpace
 *
 * @param  {object} tool_area_state
 * @return {void}
 * @method
 * @public
 */
export const execute = (property_area_state: UserPropertyAreaStateObjectImpl): void =>
{
    console.log(property_area_state);
};