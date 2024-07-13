import { $TOOL_CIRCLE_NAME } from "@/config/ToolConfig";
import { DrawTool } from "./DrawTool";
import { execute as circleToolInitializeUseCase } from "@/tool/application/CircleTool/usecase/CircleToolInitializeUseCase";

/**
 * @description 円の作成ツール
 *              Circle Creation Tools
 *
 * @class
 * @public
 * @extends {DrawTool}
 */
export class CircleTool extends DrawTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($TOOL_CIRCLE_NAME);

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
        circleToolInitializeUseCase(this);
    }
}