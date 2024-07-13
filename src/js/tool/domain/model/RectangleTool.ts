import { $TOOL_RECTANGLE_NAME } from "@/config/ToolConfig";
import { DrawTool } from "./DrawTool";
import { execute as rectangleToolInitializeUseCase } from "@/tool/application/RectangleTool/usecase/RectangleToolInitializeUseCase";

/**
 * @description 矩形作成ツール
 *              Rectangle Creation Tool
 *
 * @class
 * @public
 * @extends {DrawTool}
 */
export class RectangleTool extends DrawTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($TOOL_RECTANGLE_NAME);

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
        rectangleToolInitializeUseCase(this);
    }
}