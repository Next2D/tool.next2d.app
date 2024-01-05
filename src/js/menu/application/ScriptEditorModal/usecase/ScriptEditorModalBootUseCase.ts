import { execute as scriptEditorModalShowService } from "../service/ScriptEditorModalShowService";
/**
 * @description スクリプトエディタの起動関数
 *              Script editor startup function
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // スクリプトエディタを表示
    scriptEditorModalShowService();
};