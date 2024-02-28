import { execute as soundBufferToElementService } from "@/core/application/Sound/usecase/SoundBufferToElementService";
import { execute as soundPreviewComponent } from "@/controller/application/LibraryPreviewArea/component/SoundPreviewComponent";

/**
 * @description Fileのtype別にHTMLElementを生成
 *              Generate HTMLElement by File type
 *
 * @param  {File} file
 * @return {HTMLImageElement | HTMLVideoElement | HTMLAudioElement | void}
 * @method
 * @public
 */
export const execute = (file: File): Promise<HTMLImageElement | HTMLVideoElement | HTMLAudioElement | HTMLElement | void> =>
{
    switch (file.type) {

        case "image/svg+xml":
        case "image/png":
        case "image/jpeg":
        case "image/gif":
            return new Promise((resolve): void =>
            {
                const image = new Image();
                image.addEventListener("load", (): void =>
                {
                    resolve(image);
                });
                image.src = URL.createObjectURL(file);
            });

        case "video/mp4":
            return new Promise((resolve): void =>
            {
                const video = document.createElement("video");
                video.crossOrigin = "anonymous";
                video.muted       = true;
                video.autoplay    = false;
                video.controls    = true;

                video.addEventListener("canplaythrough", (): void =>
                {
                    resolve(video);
                });
                video.src = URL.createObjectURL(file);
                video.load();
            });

        case "audio/mpeg":
            return new Promise((resolve): void =>
            {
                const audio = document.createElement("audio");
                audio.preload  = "auto";
                audio.autoplay = false;
                audio.loop     = false;
                audio.controls = true;

                audio.addEventListener("canplaythrough", (): void =>
                {
                    file
                        .arrayBuffer()
                        .then(async (array_buffer: ArrayBuffer): Promise<void> =>
                        {
                            const canvas = await soundBufferToElementService(
                                new Uint8Array(array_buffer)
                            );

                            resolve(soundPreviewComponent(canvas, audio));
                        });
                });

                audio.src = URL.createObjectURL(file);
                audio.load();
            });

        default:
            break;

    }

    return Promise.resolve();
};