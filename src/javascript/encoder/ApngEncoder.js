/**
 * Animation PNG エンコーダー
 * Animation PNG Encoder
 *
 * @class
 */
class ApngEncoder
{
    /**
     * @param {array}   pngs
     * @param {number}  [width = 0]
     * @param {number}  [height = 0]
     * @param {number}  [fps = 60]
     * @param {boolean} [loop = true]
     * @public
     */
    constructor (pngs, width = 0, height = 0, fps = 60, loop = true)
    {
        this._$pngs   = pngs;
        this._$width  = width;
        this._$height = height;
        this._$fps    = fps;
        this._$loop   = loop ? 0 : 1;

        this._$crcTable = new Uint32Array(256);
        for (let idx = 0; idx < 256; idx++) {

            let c = idx;
            for (let idx = 0; idx < 8; idx++) {
                c = c & 1 ? 0xedb88320 ^ c >>> 1 : c >>> 1;
            }

            this._$crcTable[idx] = c;
        }
    }

    /**
     * @param  {number} crc
     * @param  {Uint8Array} buffer
     * @param  {number} offset
     * @param  {number} length
     * @return {number}
     * @method
     * @private
     */
    _$crcUpdate (crc, buffer, offset, length)
    {
        for (let idx = 0; idx < length; idx++) {
            crc = this._$crcTable[(crc ^ buffer[offset + idx]) & 0xff] ^ crc >>> 8;
        }
        return crc;
    }

    /**
     * @param  {Uint8Array} buffer
     * @param  {number} offset
     * @param  {number} length
     * @return {number}
     * @method
     * @private
     */
    _$crc (buffer, offset, length)
    {
        return this._$crcUpdate(
            0xffffffff, buffer, offset, length
        ) ^ 0xffffffff;
    }

    /**
     * @param {Uint8Array} buffer
     * @param {number} pos
     * @param {string} value
     * @method
     * @private
     */
    _$writeString (buffer, pos, value)
    {
        for (let idx = 0; idx < value.length; idx++) {
            buffer[pos + idx] = value.charCodeAt(idx);
        }
    }

    /**
     * @return {Promise}
     * @method
     * @public
     */
    encode ()
    {
        return new Promise((resolve) =>
        {
            let sequenceNumber = 0;
            let frame = 0;

            const chunks = [];
            const reader = new FileReader();

            // PNG header (8 bytes)
            const header = new Uint8Array([
                137, 80, 78, 71, 13, 10, 26, 10
            ]);
            chunks.push(header.buffer);

            const IHDR     = new Uint8Array(25);
            const IHDRView = new DataView(IHDR.buffer);
            IHDRView.setUint32(0, 13);
            this._$writeString(IHDR, 4, "IHDR");
            IHDRView.setUint32(8, this._$width);
            IHDRView.setUint32(12, this._$height);
            IHDRView.setUint8(16, 8); // bit depth
            IHDRView.setUint8(17, 6); // color_type, 2 = RGB, 6 = RGBA
            IHDRView.setUint8(18, 0); // compression method
            IHDRView.setUint8(19, 0); // filter method
            IHDRView.setUint8(20, 0); // interlace method
            IHDRView.setUint32(21, this._$crc(IHDR, 4, 4 + 13));
            chunks.push(IHDR.buffer);

            // animation control
            const acTL   = new Uint8Array(20);
            const acView = new DataView(acTL.buffer);
            acView.setUint32(0, 8);
            this._$writeString(acTL, 4, "acTL");
            acView.setUint32(8, this._$pngs.length);
            acView.setUint32(12, this._$loop);
            acView.setUint32(16, this._$crc(acTL, 4, 4 + 8));
            chunks.push(acTL.buffer);

            reader.onload = () =>
            {
                const view = new DataView(reader.result);

                let pos = 8;

                // frame control
                const fcTL   = new Uint8Array(38);
                const fcView = new DataView(fcTL.buffer);
                fcView.setUint32(0, 26);
                this._$writeString(fcTL, 4, "fcTL");
                fcView.setUint32(8, sequenceNumber++);
                fcView.setUint32(12, this._$width);
                fcView.setUint32(16, this._$height);
                fcView.setUint32(20, 0);
                fcView.setUint32(24, 0);
                fcView.setUint16(28, 1000 / this._$fps); // delay_num
                fcView.setUint16(30, 1000); // delay_den
                fcView.setUint8(32, 0); // dispose_op
                fcView.setUint8(33, 0); // blend_op
                fcView.setUint32(34, this._$crc(fcTL, 4, 4 + 26));
                chunks.push(fcTL.buffer);

                const length = reader.result.byteLength;
                for (;;) {

                    const chunkLen = view.getUint32(pos);
                    if (view.getUint32(pos + 4) === 0x49444154) {

                        if (!frame) {

                            chunks.push(
                                reader.result.slice(pos, pos + chunkLen + 8 + 4)
                            );

                        } else {

                            let fdAT   = new Uint8Array(4);
                            let fdView = new DataView(fdAT.buffer);

                            fdView.setUint32(0, chunkLen + 4);
                            chunks.push(fdAT.buffer);

                            fdAT = new Uint8Array(
                                reader.result.slice(pos, pos + chunkLen + 8 + 4)
                            );

                            fdView = new DataView(fdAT.buffer);
                            this._$writeString(fdAT, 0, "fdAT");
                            fdView.setUint32(4, sequenceNumber++);
                            fdView.setUint32(
                                chunkLen + 8,
                                this._$crc(fdAT, 0, chunkLen + 8)
                            );
                            chunks.push(fdAT.buffer);
                        }
                    }

                    pos += chunkLen + 12;
                    if (pos >= length) {
                        break;
                    }
                }

                frame++;
                if (this._$pngs.length > frame) {

                    reader.readAsArrayBuffer(this._$pngs[frame]);

                } else {

                    chunks.push(new Uint8Array([
                        0, 0, 0, 0,
                        0x49, 0x45, 0x4E, 0x44,
                        0xAE, 0x42, 0x60, 0x82
                    ]).buffer);

                    resolve(new Blob(chunks, { "type" : "image/apng" }));
                }
            };

            reader.readAsArrayBuffer(this._$pngs[0]);
        });
    }
}
