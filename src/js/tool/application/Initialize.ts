
import { execute as toolAreaInitializeUseCase } from "./ToolArea/usecase/ToolAreaInitializeUseCase";
import { execute as zoomToolInitializeUseCase } from "./ZoomTool/usecase/ZoomToolInitializeUseCase";

/**
 * @description ツールエリアの初期起動関数
 *              Initial startup function of the tool area
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    // 初期起動時のユースケース
    await toolAreaInitializeUseCase();

    // ズームのInputのイベントを登録
    zoomToolInitializeUseCase();
};