import QRCode from "qrcode";

/**
 * @description リワードアプリで読み込むQRコードを生成
 *              Generate a QR code to be read by the Rewards application
 *
 * @param  {string} room_id
 * @param  {string} user_id
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (room_id: string, user_id:string): Promise<void> =>
{
    return new Promise((resolve): void =>
    {
        QRCode
            .toDataURL(`${room_id}@${user_id}`)
            .then((src: string): void =>
            {
                const element: HTMLImageElement | null = document
                    .getElementById("billing-qrcode") as HTMLImageElement;

                if (!element) {
                    return resolve();
                }

                element.src = src;

                resolve();
            });
    });
};