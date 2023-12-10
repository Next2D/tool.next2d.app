import { execute as languageLoadRepository } from "../../domain/repository/LanguageLoadRepository";
import { $setMapping } from "../LanguageUtil";

/**
 * @description 指定した言語JSONを読み込んで、マッピング情報を更新
 *              Reads specified language JSON and updates mapping information
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
        .then((values): void =>
        {
            // 言語マッピングに登録
            $setMapping(values);
        });
};