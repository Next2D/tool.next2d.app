import { $CONVERT_MOVIE_CLIP_MODAL_NAME } from "@/config/MenuConfig";
import { BaseMenu } from "./BaseMenu";
import { execute as convertMovieClipModalInitializeRegisterEventUseCase } from "@/menu/application/ConvertMovieClipModal/usecase/ConvertMovieClipModalInitializeRegisterEventUseCase";

/**
 * @description MovieClip変換モーダルの管理クラス
 *              Convert MovieClip Modal management class
 *
 * @class
 * @public
 * @extends {BaseMenu}
 */
export class ConvertMovieClipModal extends BaseMenu
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super($CONVERT_MOVIE_CLIP_MODAL_NAME);
    }

    /**
     * @description 初期化処理
     *              Initialization process
     *
     * @return {Promise<void>}
     * @method
     * @public
     */
    async initialize (): Promise<void>
    {
        // モーダルエリアのイベントの登録
        convertMovieClipModalInitializeRegisterEventUseCase();
    }
}