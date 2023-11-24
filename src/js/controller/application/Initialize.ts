import { execute as controllerInitializeRegisterEventUseCase } from "@/controller/application/Controller/usecase/ControllerInitializeRegisterEventUseCase";
import {
    stageSetting,
    controllerTab
} from "../application/ControllerUtil";

/**
 * @description 起動対象のToolクラスの配列
 *              Array of Tool classes to be invoked
 *
 * @private
 */
const settings: any[] = [
    stageSetting,
    controllerTab
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
    // イベント登録
    controllerInitializeRegisterEventUseCase();

    // 起動
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