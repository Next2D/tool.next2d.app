import type { IPivotType } from "@/interface/IPivotType";
import { execute as referenceSettingUpdateCellValueService } from "../service/ReferenceSettingUpdateCellValueService";
import { execute as referenceSettingUpdateXService } from "../service/ReferenceSettingUpdateXService";
import { execute as referenceSettingUpdateYService } from "../service/ReferenceSettingUpdateYService";

/**
 * @description ReferenceSettingの要素を更新するユースケース
 *              Use case to update elements of ReferenceSetting
 *
 * @param {IPivotType} pivot
 * @param {number} x
 * @param {number} y
 * @method
 * @public
 */
export const execute = (pivot: IPivotType, x: number, y: number): void =>
{
    // 9方向の基準点を更新
    referenceSettingUpdateCellValueService(pivot);

    // X座標、Y座標を更新
    referenceSettingUpdateXService(x);
    referenceSettingUpdateYService(y);
};