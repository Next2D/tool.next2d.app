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
export const $getScreenOffsetLeft = (): number =>
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
export const $setScreenOffsetLeft = (value: number): void =>
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
export const $getScreenOffsetTop = (): number =>
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
export const $setScreenOffsetTop = (value: number): void =>
{
    $offsetTop = value;
};

/**
 * @description 利用したCanvas Elementをプールする配列
 *              Array to pool the Canvas Elements used
 *
 * @type {HTMLCanvasElement}
 * @private
 */
const $canvasPool: HTMLCanvasElement[] = [];

/**
 * @description Canvas Elementを返却
 *              Return Canvas Element
 *
 * @return {HTMLCanvasElement}
 * @method
 * @public
 */
export const $getCanvas = (): HTMLCanvasElement =>
{
    return $canvasPool.length
        ? $canvasPool.shift() as HTMLCanvasElement
        : document.createElement("canvas");
};

/**
 * @description 利用し終わったcanvas elementを配列に格納
 *              Store used canvas elements in an array
 *
 * @param  {HTMLCanvasElement} canvas
 * @return {void}
 * @method
 * @public
 */
export const $poolCanvas = (canvas: HTMLCanvasElement): void =>
{
    // キャンバスの描画をリセット
    canvas.width = canvas.height = 1;

    // キャッシュするcanvasの内部データを初期化
    canvas.dataset.base64 = "";
    canvas.setAttribute("class", "");
    canvas.setAttribute("style", "");

    // キャッシュ登録
    $canvasPool.push(canvas);
};

/**
 * @description ランダムなUUIDを生成
 *              Generate a random UUID
 *
 * @return {string}
 * @method
 * @public
 */
export const $generateUUID = (): string =>
{
    return "randomUUID" in crypto ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) =>
    {
        // 0〜15のランダムな整数値を生成
        const randomValue = Math.random() * 16 | 0;

        let generatedCharacter;
        if (character === "x") {
            // 'x'にはランダムな値をそのまま使用
            generatedCharacter = randomValue;
        } else {
            // 'y'は、UUIDの仕様に準拠した形に調整
            generatedCharacter = randomValue & 0x3 | 0x8;
        }

        return generatedCharacter.toString(16); // 16進数に変換して返す
    });
}