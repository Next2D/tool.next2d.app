import { BaseTool } from "./BaseTool";
import { $TOOL_USER_SETTING_NAME } from "../../../config/ToolConfig";
import { execute as userSettingToolInitializeUseCase } from "../../application/usecase/UserSettingToolInitializeUseCase";

/**
 * @description 設定ツールの管理クラス
 *              Configuration tool management class
 *
 * @class
 * @public
 * @extends {BaseTool}
 */
export class UserSettingTool extends BaseTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($TOOL_USER_SETTING_NAME);
    }

    /**
     * @description 初期起動関数
     *              initial invoking function
     *
     * @return {void}
     * @method
     * @public
     */
    initialize (): void
    {
        // 初回起動ユースケース
        userSettingToolInitializeUseCase();
    }
}