/**
 * @description 広告エリアを非表示にする
 *              Hide the ad area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById("advertisement");

    if (element) {
        element.style.display = "none";
    }

    // 内部データも0に更新
    document
        .documentElement
        .style
        .setProperty("--ad", "0px");
};