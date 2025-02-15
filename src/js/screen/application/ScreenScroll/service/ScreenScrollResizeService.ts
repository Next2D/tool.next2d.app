import { $SCREEN_ID, $SCREEN_SCROLL_BAR_X_ID, $SCREEN_SCROLL_BAR_Y_ID, $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { screenArea } from "@/screen/domain/model/ScreenArea";

/**
 * @description スクリーンエリアのスクロールバーのサイズを更新
 *              Update the size of the screen area scroll bar
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    const stageAreaElement: HTMLElement | null =  document
        .getElementById($SCREEN_STAGE_AREA_ID);

    if (!stageAreaElement) {
        return ;
    }

    const screenElement: HTMLElement | null =  document
        .getElementById($SCREEN_ID);

    if (!screenElement) {
        return ;
    }

    // スケールの計算結果を保存
    screenArea.xScale = screenElement.clientWidth / stageAreaElement.clientWidth;
    screenArea.yScale = screenElement.clientHeight / stageAreaElement.clientHeight;

    // スクリーンのスクロール幅を計算
    const xElement = document
        .getElementById($SCREEN_SCROLL_BAR_X_ID);

    if (xElement) {
        // 2pxはborderの1pxの上下の分
        document
            .documentElement
            .style
            .setProperty(
                "--screen-scroll-bar-width",
                `${Math.floor(screenElement.clientWidth * screenArea.xScale) - 2}px`
            );

        // x座標のバーを移動
        xElement.style.left = `${Math.floor(screenElement.scrollLeft * screenArea.xScale)}px`;
    }

    // スクリーンのスクロール高さを計算
    const yElement = document
        .getElementById($SCREEN_SCROLL_BAR_Y_ID);

    if (yElement) {
        // 2pxはborderの1pxの上下の分
        document
            .documentElement
            .style
            .setProperty(
                "--screen-scroll-bar-height",
                `${Math.floor(screenElement.clientHeight * screenArea.yScale) - 2}px`
            );

        // y座標のバーを移動
        yElement.style.top = `${Math.floor(screenElement.scrollTop * screenArea.yScale)}px`;
    }
};