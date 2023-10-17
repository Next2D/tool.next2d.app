import { execute as languageLoadRepository } from "../../domain/repository/LanguageLoadRepository";
import { $setMapping } from "../Language";
import { execute as languageTranslationService } from "../service/LanguageTranslationService";

/**
 * @description 指定した言語に変換
 *              Converts to specified language
 *
 * @param  {string} language
 * @return {void}
 * @method
 * @public
 */
export const execute = async (language: string): Promise<void> =>
{
    // JSONを取得してマッピングに登録
    languageLoadRepository(language)
        .then((values) =>
        {
            $setMapping(values);

            // 少しだけ遅延して指定言語に変換
            requestAnimationFrame(() =>
            {
                languageTranslationService();
            });
        });
};