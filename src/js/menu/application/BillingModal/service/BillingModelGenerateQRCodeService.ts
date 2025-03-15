import { $LIBRARY_BILLING_QRCODE_IMG_ID } from "@/config/BillingConfig";
import QRCode from "qrcode";

/**
 * @description リワードアプリで読み込むQRコードを生成
 *              Generate a QR code to be read by the Rewards application
 *
 * @param  {string} room_id
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (room_id: string): Promise<void> =>
{
    const element: HTMLImageElement | null = document
        .getElementById($LIBRARY_BILLING_QRCODE_IMG_ID) as HTMLImageElement;

    if (!element) {
        return ;
    }

    element.src = await QRCode.toDataURL(`${room_id}`, { "width": 320 });
};