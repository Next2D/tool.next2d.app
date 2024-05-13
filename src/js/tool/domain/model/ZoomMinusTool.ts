import { $TOOL_ZOOM_MINUS_NAME } from "@/config/ToolConfig";
import { BaseTool } from "./BaseTool";
import { execute as zoomMinusToolInitializeUseCase } from "@/tool/application/ZoomMinusTool/usecase/ZoomMinusToolInitializeUseCase";

/**
 * @description ズームの縮小ツールの管理クラス
 *              Zoom reduction tool management class
 *
 * @class
 * @public
 * @extends {BaseTool}
 */
export class ZoomMinusTool extends BaseTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($TOOL_ZOOM_MINUS_NAME);

        // カーソルをセット
        this.setCursor("zoom-out");
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
        zoomMinusToolInitializeUseCase(this);
    }
}