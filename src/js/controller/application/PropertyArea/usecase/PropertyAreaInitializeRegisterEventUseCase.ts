import { execute as soundAreaInitializeRegisterEventUseCase } from "@/controller/application/SoundArea/usecase/SoundAreaInitializeRegisterEventUseCase";
import { execute as propertyAreaRegisterTitleEventUseCase } from "./PropertyAreaRegisterTitleEventUseCase";
import { execute as propertyAreaRegisterMoveEventUseCase } from "./PropertyAreaRegisterMoveEventUseCase";
import { execute as objectSettingRegisterEventUseCase } from "@/controller/application/ObjectSetting/usecase/ObjectSettingRegisterEventUseCase";
import { execute as transformSettingInitializeRegisterEventUseCase } from "@/controller/application/TransformSetting/usecase/TransformSettingInitializeRegisterEventUseCase";

/**
 * @description プロパティーエリアの移動イベントを登録
 *              Register property area move events
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // プロパティーエリアのタイトルのマウスダウンイベントを登録
    propertyAreaRegisterTitleEventUseCase();

    // プロパティーエリアの移動イベントを登録
    propertyAreaRegisterMoveEventUseCase();

    // サウンドエリアのイベント登録
    soundAreaInitializeRegisterEventUseCase();

    // オブジェクトエリアのイベント登録
    objectSettingRegisterEventUseCase();

    // 変形設定エリアのイベント登録
    transformSettingInitializeRegisterEventUseCase();
};