import { $TOOL_ZOOM_PLUS_NAME } from "@/config/ToolConfig";
import { BaseTool } from "./BaseTool";
import { execute as zoomPlusToolInitializeUseCase } from "@/tool/application/ZoomPlusTool/usecase/ZoomPlusToolInitializeUseCase";

/**
 * @description ズームの拡大ツールの管理クラス
 *              Management class for zoom magnification tool
 *
 * @class
 * @public
 * @extends {BaseTool}
 */
export class ZoomPlusTool extends BaseTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($TOOL_ZOOM_PLUS_NAME);
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
        zoomPlusToolInitializeUseCase(this);
    }
}