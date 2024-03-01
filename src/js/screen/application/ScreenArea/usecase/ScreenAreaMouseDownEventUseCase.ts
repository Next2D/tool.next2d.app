import { execute as screenAreaRunParentMovieClipUseCase } from "./ScreenAreaRunParentMovieClipUseCase";

/**
 * @description ダブルタップ用の待機フラグ
 *              Standby flag for double-tap
 *
 * @type {boolean}
 * @private
 */
let wait: boolean = false;

/**
 * @description
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    if (!wait) {

        // 初回のタップであればダブルタップを待機モードに変更
        wait = true;

        // ダブルタップ有効期限をセット
        setTimeout((): void =>
        {
            wait = false;
        }, 300);

    } else {

        // ダブルタップを終了
        wait = false;

        // 親のイベントを終了
        event.stopPropagation();
        event.preventDefault();

        // 親のMovieClipに移動
        screenAreaRunParentMovieClipUseCase();
    }
};