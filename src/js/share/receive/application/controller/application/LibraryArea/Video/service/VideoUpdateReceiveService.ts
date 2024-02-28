import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { VideoSaveObjectImpl } from "@/interface/VideoSaveObjectImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { Video } from "@/core/domain/model/Video";
import { execute as libraryAreaUpdateVideoHistoryUseCase } from "@/history/application/controller/application/LibraryArea/Video/usecase/LibraryAreaUpdateVideoHistoryUseCase";
import { execute as shareGetS3EndPointRepository } from "@/share/domain/repository/ShareGetS3EndPointRepository";
import { execute as shareGetS3FileRepository } from "@/share/domain/repository/ShareGetS3FileRepository";
import { execute as binaryToBufferService } from "@/core/service/BinaryToBufferService";

// @ts-ignore
import ZlibInflateWorker from "@/worker/ZlibInflateWorker?worker&inline";

/**
 * @type {Worker}
 * @private
 */
const worker: Worker = new ZlibInflateWorker();

/**
 * @description socketで受け取った情報の受け取り処理関数
 *              Receiving and processing functions for information received in the socket
 *
 * @param  {object} message
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (message: ShareReceiveMessageImpl): Promise<void> =>
{
    const id = message.data[0] as NonNullable<number>;

    const workSpace = $getWorkSpace(id);
    if (!workSpace) {
        return ;
    }

    const libraryId = message.data[1] as NonNullable<number>;
    const movieClip: InstanceImpl<MovieClip> = workSpace.getLibrary(libraryId);
    if (!movieClip) {
        return ;
    }

    // バイナリをUint8Arrayに変換
    const videoObject = message.data[3] as NonNullable<VideoSaveObjectImpl>;

    // 変更前のBitmapからセーブオブジェクトを作成
    const video: InstanceImpl<Video> = workSpace.getLibrary(videoObject.id);
    const beforeVideoObject = video.toObject();

    // バイナリをUint8Arrayに変換
    const url = await shareGetS3EndPointRepository(message.data[4] as string, "get");
    const binary = await shareGetS3FileRepository(url);
    const buffer: Uint8Array = binaryToBufferService(binary);

    return new Promise((reslove): void =>
    {
        worker.onmessage = (event: MessageEvent): void =>
        {
            videoObject.buffer = event.data as Uint8Array;
            const video = new Video(videoObject);

            // 内部情報に追加
            // fixed logic
            workSpace.libraries.set(video.id, video);

            // 作業履歴に残す
            // fixed logic
            libraryAreaUpdateVideoHistoryUseCase(
                workSpace,
                movieClip,
                beforeVideoObject,
                video,
                true
            );

            reslove();
        };

        // サブスレッドで解答処理を行う
        worker.postMessage(buffer, [buffer.buffer]);
    });
};