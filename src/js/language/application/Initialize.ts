import { execute as languageTranslationUseCase } from "./usecase/LanguageTranslationUseCase";
import { execute as userLanguageSettingObjectGetService } from "@/user/application/Language/service/UserLanguageSettingObjectGetService";
import { execute as userLanguageSettingObjectUpdateService } from "@/user/application/Language/service/UserLanguageSettingObjectUpdateService";

/**
 * @description LocalStorageから言語設定を読み込んで、指定言語に変換
 *              Read language settings from LocalStorage and convert to specified language
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (): Promise<void> =>
{
    let language: string | null = userLanguageSettingObjectGetService();
    if (!language) {

        switch (navigator.language) {

            case "ja":
                language = "Japanese";
                break;

            case "ko":
                language = "Korean";
                break;

            case "zh":
                language = "Chinese";
                break;

            case "fr":
                language = "French";
                break;

            case "ru":
                language = "Russia";
                break;

            case "it":
                language = "Italiano";
                break;

            case "es":
                language = "Spanish";
                break;

            case "bg":
                language = "Bulgaria";
                break;

            case "fi":
                language = "Finland";
                break;

            case "de":
                language = "Germany";
                break;

            case "hu":
                language = "Hungary";
                break;

            case "id":
                language = "indonesia";
                break;

            case "lv":
                language = "Latvia";
                break;

            case "lt":
                language = "Lithuania";
                break;

            case "nl":
                language = "Netherlands";
                break;

            case "pl":
                language = "Poland";
                break;

            case "ro":
                language = "Romania";
                break;

            case "sk":
                language = "Slovakia";
                break;

            case "tr":
                language = "Turkey";
                break;

            default:
                language = "English";
                break;

        }

        // LocalStorageに言語設定がなければブラウザのナビゲーションの言語をセット
        userLanguageSettingObjectUpdateService(language);
    }

    // 対象の言語JSONを取得する
    return languageTranslationUseCase(language);
};