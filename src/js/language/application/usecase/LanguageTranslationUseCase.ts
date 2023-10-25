import { execute as languageLoadRepository } from "../../domain/repository/LanguageLoadRepository";
import { $setMapping } from "../LanguageUtil";

/**
 * @description 指定した言語に変換
 *              Converts to specified language
 *
 * @param  {string} language
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (language: string): Promise<void> =>
{
    // JSONを取得してマッピングに登録
    return languageLoadRepository(language)
        .then((values) =>
        {
            // 言語マッピングに登録
            $setMapping(values);
        });
};