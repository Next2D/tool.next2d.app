import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { SoundSaveObjectImpl } from "@/interface/SoundSaveObjectImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { Sound } from "@/core/domain/model/Sound";
import { execute as externalLibraryAddInstanceUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryAddInstanceUseCase";
import { execute as libraryAreaAddNewSoundHistoryUseCase } from "@/history/application/controller/application/LibraryArea/Sound/usecase/LibraryAreaAddNewSoundHistoryUseCase";
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
 * @return {void}
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

    // 受け取ったSoundのbufferはZlibで圧縮されてるので解答が必要
    const soundSaveObject = message.data[2] as NonNullable<SoundSaveObjectImpl>;

    // バイナリをUint8Arrayに変換
    const url = await shareGetS3EndPointRepository(message.data[3] as string, "get");
    const binary = await shareGetS3FileRepository(url);
    const buffer: Uint8Array = binaryToBufferService(binary);

    return new Promise((reslove): void =>
    {
        // 解答が完了したらバイナリデータとして返却
        worker.onmessage = (event: MessageEvent): void =>
        {
            soundSaveObject.buffer = event.data as Uint8Array;

            // 転送データからBitmapデータを生成
            const sound = new Sound(soundSaveObject);

            // 内部情報に追加
            // fixed logic
            externalLibraryAddInstanceUseCase(workSpace, sound);

            // 作業履歴に残す
            // fixed logic
            libraryAreaAddNewSoundHistoryUseCase(
                workSpace,
                movieClip,
                sound,
                true
            );

            reslove();
        };

        // サブスレッドで解答処理を行う
        worker.postMessage(buffer, [buffer.buffer]);
    });
};