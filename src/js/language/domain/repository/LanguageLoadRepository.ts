import { $LANGUAGE_URL } from "@/config/LanguageConfig";

/**
 * @description 指定された言語のJSONを取得してobjectに変換して返却
 *              Obtains JSON in the specified language, converts it to an object, and returns it
 *
 * @param  {string} language
 * @return {object}
 * @method
 * @public
 */
export const execute = (language: string): Promise<any> =>
{
    return fetch(`${$LANGUAGE_URL}/${language.toLocaleLowerCase()}.json`)
        .then((response: Response): Promise<any> =>
        {
            return response.json();
        });
};