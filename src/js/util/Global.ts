/**
 * @description 現在のカーソルタイプ
 *              Current cursor type
 *
 * @type {string}
 * @default "auto"
 * @private
 */
let $currentCursor: string = "auto";

/**
 * @description 画面のカーソル画像を切り替える
 *              Switching the screen cursor image
 *
 * @return {void}
 * @method
 * @public
 */
export const $setCursor = (value: string = "auto"): void =>
{
    if ($currentCursor !== value) {

        $currentCursor = value;

        document
            .documentElement
            .style
            .setProperty("--tool-cursor", value);
    }
};

/**
 * @description 指定の数値を最小値と最大値の間に収める
 *              Fits the specified number between the minimum and maximum values.
 *
 * @return {void}
 * @method
 * @public
 */
export const $clamp = (value: number, min: number, max: number): number =>
{
    const number = +value;
    return Math.min(Math.max(min, isNaN(number) || !isFinite(number) ? 0 : number), max);
};

/**
 * @description スクリーンの現在のスケール値
 *              Current scale value of screen
 *
 * @type {number}
 * @default 1
 * @private
 */
let $currentZoom: number = 1;

/**
 * @description スクリーンのスケール値をセット
 *              Set screen scale value
 *
 * @param  {number} scale
 * @return {void}
 * @method
 * @public
 */
export const $setZoom = (scale: number): void =>
{
    $currentZoom = scale;
};

/**
 * @description スクリーンのスケール値を取得
 *              Get screen scale value
 *
 * @return {void}
 * @method
 * @public
 */
export const $getZoom = (): number =>
{
    return $currentZoom;
};

/**
 * @description ステージElementのoffsetLeft値
 *              OffsetLeft value of StageElement
 *
 * @type {number}
 * @default 0
 * @private
 */
let $offsetLeft: number = 0;

/**
 * @description ステージElementのoffsetLeft値を取得
 *              Get the offsetLeft value of the stageElement
 *
 * @return {void}
 * @method
 * @public
 */
export const $getOffsetLeft = (): number =>
{
    return $offsetLeft;
};

/**
 * @description ステージElementのoffsetLeft値をセット
 *              Set the offsetLeft value of the stageElement
 *
 * @return {void}
 * @method
 * @public
 */
export const $setOffsetLeft = (value: number): void =>
{
    $offsetLeft = value;
};

/**
 * @description ステージElementのoffsetTop値
 *              OffsetTop value of StageElement
 *
 * @type {number}
 * @default 0
 * @private
 */
let $offsetTop: number = 0;

/**
 * @description ステージElementのoffsetTop値を取得
 *              Get the offsetTop value of the stageElement
 *
 * @return {void}
 * @method
 * @public
 */
export const $getOffsetTop = (): number =>
{
    return $offsetTop;
};

/**
 * @description ステージElementのoffsetTop値をセット
 *              Set the offsetTop value of the stageElement
 *
 * @return {void}
 * @method
 * @public
 */
export const $setOffsetTop = (value: number): void =>
{
    $offsetTop = value;
};
