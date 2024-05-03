import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as propertyAreaDisplayItemControllerUseCase } from "@/controller/application/PropertyArea/usecase/PropertyAreaDisplayItemControllerUseCase";

/**
 * @description スクリーンで選択したアイテム(単一)の設定を表示
 *              Display the settings for the item (single) selected on the screen
 *
 * @param  {number} library_id
 * @return {void}
 * @method
 * @public
 */
export const execute = (library_id: number): void =>
{
    const workSpace = $getCurrentWorkSpace();
    const instance  = workSpace.getLibrary(library_id);
    if (!instance) {
        return ;
    }

    // プロパティーエリアの表示項目を変更
    propertyAreaDisplayItemControllerUseCase(instance.type);
};