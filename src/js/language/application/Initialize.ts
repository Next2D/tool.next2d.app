import { execute as languageTranslationUseCase } from "../application/usecase/LanguageTranslationUseCase";
import { execute as userLanguageSettingObjectGetService } from "../../user/application/service/UserLanguageSettingObjectGetService";

/**
 * @description LocalStorageから言語設定を読み込んで、指定言語に変換
 *              Read language settings from LocalStorage and convert to specified language
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    let language: string | null = userLanguageSettingObjectGetService();

    if (!language) {

        switch (navigator.language) {

            case "ja":
                language = "japanese";
                break;

            case "ko":
                language = "korean";
                break;

            case "zh":
                language = "chinese";
                break;

            case "fr":
                language = "french";
                break;

            case "ru":
                language = "russia";
                break;

            case "it":
                language = "italiano";
                break;

            case "es":
                language = "spanish";
                break;

            case "bg":
                language = "bulgaria";
                break;

            case "fi":
                language = "finland";
                break;

            case "de":
                language = "germany";
                break;

            case "hu":
                language = "hungary";
                break;

            case "id":
                language = "indonesia";
                break;

            case "lv":
                language = "latvia";
                break;

            case "lt":
                language = "lithuania";
                break;

            case "nl":
                language = "netherlands";
                break;

            case "pl":
                language = "poland";
                break;

            case "ro":
                language = "romania";
                break;

            case "sk":
                language = "slovakia";
                break;

            case "tr":
                language = "turkey";
                break;

            default:
                language = "english";
                break;

        }

    }

    languageTranslationUseCase(language.toLocaleLowerCase());
};