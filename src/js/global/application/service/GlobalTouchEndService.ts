/**
 * @type {number}
 * @private
 */
let $lastTouchTime: number = 0;

/**
 * @description タブレットでのダブルタップでのズーム処理を制御
 *              Control zoom processing with double tap on tablet
 *
 * @param  {TouchEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: TouchEvent): void =>
{
    const now = performance.now();
    if (now - $lastTouchTime <= 500) {
        event.preventDefault();
    }

    // タップされた時間を記録
    $lastTouchTime = now;
};