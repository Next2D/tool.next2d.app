/**
 * @class
 * @memberOf view.controller
 */
class SoundWaveform
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {number}
         * @default 280
         * @private
         */
        this._$width = 280;

        /**
         * @type {number}
         * @default 60
         * @private
         */
        this._$height = 60;
    }

    /**
     * @description canvasに波形情報を描画
     *
     * @param  {Uint8Array} buffer
     * @return {void}
     * @method
     * @public
     */
    draw (buffer)
    {
        this
            .load(buffer, this._$width)
            .then((channels) =>
            {
                const ch1 = channels[0];
                const ch2 = channels[1];

                const canvas  = Util.$getCanvas();
                canvas.width  = this._$width  * window.devicePixelRatio;
                canvas.height = this._$height * window.devicePixelRatio;
                const context = canvas.getContext("2d");

                const barWidth    = canvas.width / ch1.length;
                const halfCanvasH = canvas.height / 2;

                context.fillStyle = "#1355a5";
                for (let idx = 0; idx < ch1.length; ++idx) {

                    //ch1
                    const ch1Height = ch1[idx] * halfCanvasH;
                    context.fillRect(idx * barWidth, halfCanvasH - ch1Height, barWidth, ch1Height);

                    //ch2
                    const ch2Height = ch2[idx] * halfCanvasH;
                    context.fillRect(idx * barWidth, halfCanvasH, barWidth, ch2Height);

                }

                canvas.setAttribute(
                    "style",
                    `margin-bottom: 10px; width: ${this._$width}px; height: ${this._$height}px`
                );

                document
                    .getElementById("library-preview-area")
                    .prepend(canvas);
            });
    }

    /**
     * @description 音声データを変換して波形配列を取得
     *
     * @param  {Uint8Array} buffer
     * @param  {number} width
     * @return {Promise}
     * @method
     * @public
     */
    load (buffer, width)
    {
        return Util.
            $audioContext
            .decodeAudioData(buffer.buffer)
            .then((buffer) =>
            {
                const ch1 = buffer.getChannelData(0);
                const peaks1 = this.getPeaks(ch1, width * window.devicePixelRatio);

                const ch2 = buffer.getChannelData(1);
                const peaks2 = this.getPeaks(ch2, width * window.devicePixelRatio);

                return [peaks1, peaks2];
            });
    }

    /**
     * @description 波形の幅を配列にして返す
     *
     * @param  {Float32Array} buffer
     * @param  {number} width
     * @return {array}
     * @method
     * @public
     */
    getPeaks (buffer, width)
    {
        let step;

        step = Math.floor(buffer.length / width * window.devicePixelRatio);

        if (step < 1) {
            step = 1;
        }

        let peaks = [];
        for (let idx = 0; idx < buffer.length; idx += step) {
            const peak = this.getPeak(buffer, idx, idx + step);
            peaks.push(peak);
        }

        return peaks;
    }

    /**
     * @description 個別の波形の幅を返す
     *
     * @param  {Float32Array} buffer
     * @param  {number} start_index
     * @param  {number} end_index
     * @return {number}
     * @method
     * @public
     */
    getPeak (buffer, start_index, end_index)
    {
        const sliced = buffer.slice(start_index, end_index);

        let peak = -100;
        for (let idx = 0; idx < sliced.length; idx++) {
            const sample = sliced[idx];
            if (sample > peak) {
                peak = sample;
            }
        }

        return peak;
    }
}

Util.$soundWaveform = new SoundWaveform();
