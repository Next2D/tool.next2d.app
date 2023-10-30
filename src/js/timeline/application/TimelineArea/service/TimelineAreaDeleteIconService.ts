
/**
 * @description ヘッダーのラベル、サウンド、スクリプトのアイコン削除処理
 *              Header label, sound, and script icon removal process
 *
 * @param  {Event} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: Event): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    // TODO
    console.log([event]);
};