import { $getAudioContext } from "../../CoreUtil";
import { execute as soundWaveformGetPeaksUseCase } from "./SoundWaveformGetPeaksUseCase";

/**
 * @description 音声データを波形配列に変換
 *              Converts voice data to waveform array
 *
 * @param  {Uint8Array} buffer
 * @param  {number} width
 * @return {array}
 * @method
 * @public
 */
export const execute = async (buffer: Uint8Array, width: number): Promise<void | Array<number[]>> =>
{
    const audioContext = $getAudioContext();
    if (!audioContext) {
        return Promise.resolve();
    }

    const audioBuffer = await audioContext.decodeAudioData(buffer.buffer);

    const ch1 = audioBuffer.getChannelData(0);
    const peaks1 = soundWaveformGetPeaksUseCase(
        ch1, width * window.devicePixelRatio
    );

    // モノラルの時はch1だけの波形を返却
    if (audioBuffer.numberOfChannels === 1) {
        return [
            peaks1,
            peaks1
        ];
    }

    // ステレオの時はch2の波形を取得
    const ch2 = audioBuffer.getChannelData(1);
    const peaks2 = soundWaveformGetPeaksUseCase(
        ch2, width * window.devicePixelRatio
    );

    return [
        peaks1,
        peaks2
    ];
};