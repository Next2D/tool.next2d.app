/**
 * @class
 * @memberOf view.timeline
 */
class TimelineHighlight
{
    /**
     * @description ランダムにカラーを返す
     *
     * @return {string}
     * @static
     */
    static get color ()
    {
        const colors = [
            "#ff0000",
            "#0000ff",
            "#32cd32",
            "#ffc0cb",
            "#ffd700",
            "#ff8c00",
            "#00ffff",
            "#ff00ff",
            "#008080",
            "#ff7f50",
            "#00bfff",
            "#ff6347",
            "#fa8072",
            "#adff2f",
            "#ff69b4",
            "#7fff00",
            "#ffffe0",
            "#87cefa",
            "#9370db"
        ];

        const index = Math.random() * colors.length | 0;
        return colors[index];
    }
}
