import { $TOOL_TEXT_NAME } from "@/config/ToolConfig";
import { BaseTool } from "./BaseTool";
import { execute as textToolInitializeUseCase } from "@/tool/application/TextTool/usecase/TextToolInitializeUseCase";

/**
 * @description テキストツールの管理クラス
 *              TextTools Management Class
 *
 * @class
 * @public
 * @extends {BaseTool}
 */
export class TextTool extends BaseTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($TOOL_TEXT_NAME);

        // カーソルをセット
        this.setCursor("crosshair");
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
        textToolInitializeUseCase(this);
    }
}