import { $OBJECT_SETTING_NAME_ID, $OBJECT_SETTING_SYMBOL_ID } from "@/config/ObjectSettingConfig";

/**
 * @description オブジェクト設定のイベントを登録
 *              Register object setting events
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const nameElement: HTMLInputElement | null = document
        .getElementById($OBJECT_SETTING_NAME_ID) as HTMLInputElement;

    // 名前のinputにイベントを登録
    if (nameElement) {
        nameElement.addEventListener("focusin", () => {});
        nameElement.addEventListener("focusout", () => {});
        nameElement.addEventListener("keypress", () => {});
    }

    const symbolElement: HTMLInputElement | null = document
        .getElementById($OBJECT_SETTING_SYMBOL_ID) as HTMLInputElement;

    // シンボルのinputにイベントを登録
    if (symbolElement) {
        symbolElement.addEventListener("focusin", () => {});
        symbolElement.addEventListener("focusout", () => {});
        symbolElement.addEventListener("keypress", () => {});
    }
};