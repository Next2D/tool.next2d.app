import { $TOOL_ROUND_RECT_NAME } from "@/config/ToolConfig";
import { DrawTool } from "./DrawTool";
import { execute as roundRectToolInitializeUseCase } from "@/tool/application/RoundRectTool/usecase/RoundRectToolInitializeUseCase";

/**
 * @description 角丸矩形作成ツール
 *              Rounded Rectangle Creation Tool
 *
 * @class
 * @public
 * @extends {DrawTool}
 */
export class RoundRectTool extends DrawTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($TOOL_ROUND_RECT_NAME);

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
        roundRectToolInitializeUseCase(this);
    }
}