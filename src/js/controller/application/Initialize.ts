import { execute as controllerInitializeRegisterEventUseCase } from "@/controller/application/ControllerArea/usecase/ControllerInitializeRegisterEventUseCase";
import { execute as propertyAreaInitializeRegisterEventUseCase } from "@/controller/application/PropertyArea/usecase/PropertyAreaInitializeRegisterEventUseCase";
import { execute as controllerAdjustmentInitializeRegisterEventUseCase } from "@/controller/application/ControllerAdjustment/usecase/ControllerAdjustmentInitializeRegisterEventUseCase";
import { controllerTab } from "../domain/model/ControllerTab";
import { stageSetting } from "../domain/model/StageSetting";
import { libraryArea } from "../domain/model/LibraryArea";

/**
 * @description 起動対象のToolクラスの配列
 *              Array of Tool classes to be invoked
 *
 * @private
 */
const settings: any[] = [
    stageSetting,
    controllerTab,
    libraryArea
];

/**
 * @description コントローラーエリアの初期起動関数
 *              Initial startup function of the controller area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    //  コントローラーエリアのイベント登録
    controllerInitializeRegisterEventUseCase();

    //  コントローラー幅調整のイベント登録
    controllerAdjustmentInitializeRegisterEventUseCase();

    // プロパティーの移動イベント登録
    propertyAreaInitializeRegisterEventUseCase();

    // 設定クラスの初期起動関数を実行
    const promises: Promise<void>[] = [];
    for (let idx: number = 0; idx < settings.length; ++idx) {
        const setting = settings[idx];
        if (!setting.initialize) {
            continue;
        }
        promises.push(setting.initialize());
    }

    await Promise.all(promises);
};