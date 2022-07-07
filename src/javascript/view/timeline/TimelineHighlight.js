/**
 * @class
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
            "#ef857d",
            "#ffedab",
            "#a3d6cc",
            "#8d93c8",
            "#e3acae",
            "#ea5550",
            "#00947a",
            "#4d4398",
            "#915da3",
            "#ed6d35",
            "#bd6856",
            "#72640c",
            "#98605e",
            "#6c3524",
            "#f8f4e6",
            "#6a1917",
            "#7f1184",
            "#00afcc",
            "#e3e548",
            "#af0082",
            "#0073a8",
            "#e4007f"
        ];

        const index = Math.random() * colors.length | 0;
        return colors[index];
    }
}
