import { execute as controllerInitializeRegisterEventUseCase } from "@/controller/application/ControllerArea/usecase/ControllerInitializeRegisterEventUseCase";
import { execute as controllerAdjustmentInitializeRegisterEventUseCase } from "@/controller/application/ControllerAdjustment/usecase/ControllerAdjustmentInitializeRegisterEventUseCase";
import { execute as alignSettingInitializeRegisterEventUseCase } from "@/controller/application/AlignSetting/usecase/AlignSettingInitializeRegisterEventUseCase";
import { execute as blendModeSettingInitializeRegisterEventUseCase } from "@/controller/application/BlendModeSetting/usecase/BlendModeSettingInitializeRegisterEventUseCase";
import { controllerTab } from "../domain/model/ControllerTab";
import { stageSetting } from "../domain/model/StageSetting";
import { libraryArea } from "../domain/model/LibraryArea";
import { transformSetting } from "../domain/model/TransformSetting";
import { soundArea } from "../domain/model/SoundArea";
import { objectSetting } from "../domain/model/ObjectSetting";
import { propertyArea } from "../domain/model/PropertyArea";
import { historyArea } from "../domain/model/HistoryArea";
import { scriptArea } from "../domain/model/ScriptArea";
import { referenceSetting } from "../domain/model/ReferenceSetting";
import { colorSetting } from "../domain/model/ColorSetting";

/**
 * @description 起動対象のToolクラスの配列
 *              Array of Tool classes to be invoked
 *
 * @private
 */
const settings: any[] = [
    propertyArea,
    stageSetting,
    controllerTab,
    libraryArea,
    transformSetting,
    soundArea,
    objectSetting,
    historyArea,
    scriptArea,
    referenceSetting,
    colorSetting
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

    // 整列設定のイベント登録
    alignSettingInitializeRegisterEventUseCase();

    // ブレンドモード設定のイベント登録
    blendModeSettingInitializeRegisterEventUseCase();

    // 設定クラスの初期起動関数を実行
    for (let idx = 0; idx < settings.length; ++idx) {
        const setting = settings[idx];
        if (!setting.initialize) {
            continue;
        }
        await setting.initialize();
    }
};