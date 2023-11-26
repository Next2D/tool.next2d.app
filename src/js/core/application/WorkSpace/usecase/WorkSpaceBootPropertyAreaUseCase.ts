import { $CONTROLLER_AREA_PROPERTY_ID } from "@/config/PropertyConfig";
import { UserPropertyAreaStateObjectImpl } from "@/interface/UserPropertyAreaStateObjectImpl";
import { execute as propertyAreaChageStyleToActiveService } from "@/controller/application/PropertyArea/service/PropertyAreaChageStyleToActiveService";
import { execute as propertyAreaShowTabService } from "@/controller/application/PropertyArea/service/PropertyAreaShowTabService";
import { execute as propertyAreaHideTabService } from "@/controller/application/PropertyArea/service/PropertyAreaHideTabService";
import { execute as propertyAreaChageStyleToInactiveService } from "@/controller/application/PropertyArea/service/PropertyAreaChageStyleToInactiveService";

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
    const element: HTMLElement | null = document
        .getElementById($CONTROLLER_AREA_PROPERTY_ID);

    if (!element) {
        return ;
    }

    // 状態に合わせてstyleを更新
    if (property_area_state.state === "move") {
        propertyAreaChageStyleToActiveService(element);
        propertyAreaHideTabService();
    } else {
        propertyAreaChageStyleToInactiveService(element);
        propertyAreaShowTabService();
    }
};