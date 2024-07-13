
import { execute as toolAreaInitializeUseCase } from "./ToolArea/usecase/ToolAreaInitializeUseCase";
import { execute as zoomToolInitializeUseCase } from "./ZoomTool/usecase/ZoomToolInitializeUseCase";
import { execute as fillColorInitializeUseCase } from "./FillColor/usecase/FillColorInitializeUseCase";
import { execute as strokeColorInitializeUseCase } from "./StrokeColor/usecase/StrokeColorInitializeUseCase";
import { execute as strokeSizeInitializeUseCase } from "./StrokeSize/usecase/StrokeSizeInitializeUseCase";

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

    // 塗りのinputのイベントを登録
    fillColorInitializeUseCase();

    // 線のinputのイベントを登録
    strokeColorInitializeUseCase();

    // 線の幅のinputのイベントを登録
    strokeSizeInitializeUseCase();
};