import { execute as libraryMenuOpenFileLoadingModalService } from "../service/LibraryMenuOpenFileLoadingModalService";

/**
 * @description 外部ファイル読込ボタンのイベント実行関数
 *              Execution function of the external file read button event
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    event.stopPropagation();
    event.preventDefault();

    // 読み込み画面を起動
    libraryMenuOpenFileLoadingModalService();
};