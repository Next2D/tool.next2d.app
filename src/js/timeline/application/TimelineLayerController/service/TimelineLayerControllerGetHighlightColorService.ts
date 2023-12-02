/**
 * @description カラーリスト
 *              Color List
 *
 * @type {array}
 * @private
 */
const colors: string[] = [
    "#ff0000",
    "#0000ff",
    "#32cd32",
    "#ffc0cb",
    "#ffd700",
    "#ff8c00",
    "#00ffff",
    "#ff00ff",
    "#008080",
    "#00bfff",
    "#ff6347",
    "#fa8072",
    "#ff69b4",
    "#7fff00",
    "#ffffe0",
    "#9370db"
];

/**
 * @description タイムラインのレイヤーのハイライトカラーを生成して返却
 *              Generate and return highlight colors for timeline layers
 *
 * @return {string}
 * @method
 * @public
 */
export const execute = (): string =>
{
    const index: number = Math.random() * colors.length | 0;
    return colors[index];
};