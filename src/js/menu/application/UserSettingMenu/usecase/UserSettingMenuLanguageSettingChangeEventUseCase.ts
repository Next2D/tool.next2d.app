import { execute as userLanguageSettingObjectUpdateService } from "../../../../user/application/Language/service/UserLanguageSettingObjectUpdateService";
import { execute as languageTranslationUseCase } from "../../../../language/application/usecase/LanguageTranslationUseCase";

/**
 * @description 言語設定の初期起動ユースケース
 *              Initial startup use case for language settings
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: Event): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    if (event.target) {

        const element: HTMLSelectElement = event.target as HTMLSelectElement;

        const language: string = element.value;
        if (!language) {
            return ;
        }

        // 更新情報をLocalStorageに保存
        userLanguageSettingObjectUpdateService(language);

        // 変更された言語に切り替える
        languageTranslationUseCase(language);
    }
};