/**
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
     * @param  {number} c
     * @param  {Uint8Array} buffer
     * @param  {number} offset
     * @param  {number} length
     * @return {number}
     * @private
     */
    _$crcUpdate (c, buffer, offset, length)
    {
        for (let idx = 0; idx < length; idx++) {
            c = this._$crcTable[(c ^ buffer[offset + idx]) & 0xff] ^ c >>> 8;
        }
        return c;
    }

    /**
     * @param  {Uint8Array} buffer
     * @param  {number} offset
     * @param  {number} length
     * @return {number}
     * @private
     */
    _$crc (buffer, offset, length)
    {
        return this._$crcUpdate(0xffffffff, buffer, offset, length) ^ 0xffffffff;
    }

    /**
     * @param {Uint8Array} buffer
     * @param {number} pos
     * @param {string} value
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
     * @public
     */
    encode ()
    {
        return new Promise((resolve) =>
        {
            let sequence_number = 0;
            let frame = 0;

            const chunks = [];
            const reader = new FileReader();

            // PNG header (8 bytes)
            const header = new Uint8Array([
                137, 80, 78, 71, 13, 10, 26, 10
            ]);
            chunks.push(header.buffer);

            // add IHDR chunk (25 bytes)
            const IHDR = new Uint8Array(25);
            const IHDR_view = new DataView(IHDR.buffer);
            IHDR_view.setUint32(0, 13);
            this._$writeString(IHDR, 4, "IHDR");
            IHDR_view.setUint32(8, this._$width);
            IHDR_view.setUint32(12, this._$height);
            IHDR_view.setUint8(16, 8); // bit depth
            IHDR_view.setUint8(17, 6); // color_type, 2 = RGB, 6 = RGBA
            IHDR_view.setUint8(18, 0); // compression method
            IHDR_view.setUint8(19, 0); // filter method
            IHDR_view.setUint8(20, 0); // interlace method
            IHDR_view.setUint32(21, this._$crc(IHDR, 4, 4 + 13));
            chunks.push(IHDR.buffer);

            // add acTL (animation control chunk 20 bytes)
            const acTL = new Uint8Array(20);
            const acTL_view = new DataView(acTL.buffer);
            acTL_view.setUint32(0, 8);
            this._$writeString(acTL, 4, "acTL");
            acTL_view.setUint32(8, this._$pngs.length);
            acTL_view.setUint32(12, this._$loop); // num_plays, 0 = loop forever
            acTL_view.setUint32(16, this._$crc(acTL, 4, 4 + 8));
            chunks.push(acTL.buffer);

            reader.onload = () =>
            {
                const view = new DataView(reader.result);

                let pos = 8;

                //######################################
                // add fcTL (frame control chunk 38 bytes)
                //######################################
                const fcTL = new Uint8Array(38);
                const fcTL_view = new DataView(fcTL.buffer);
                fcTL_view.setUint32(0, 26);
                this._$writeString(fcTL, 4, "fcTL");
                fcTL_view.setUint32(8, sequence_number++);
                fcTL_view.setUint32(12, this._$width);
                fcTL_view.setUint32(16, this._$height);
                fcTL_view.setUint32(20, 0);
                fcTL_view.setUint32(24, 0);
                // The delay_num and delay_den parameters together specify a fraction
                // indicating the time to display the current frame, in seconds. If the denominator
                // is 0, it is to be treated as if it were 100 (that is, `delay_num` then specifies
                // 1/100ths of a second). If the the value of the numerator is 0 the decoder should
                // render the next frame as quickly as possible, though viewers may impose a
                // reasonable lower bound.
                fcTL_view.setUint16(28, 1000 / this._$fps); // delay_num
                fcTL_view.setUint16(30, 1000); // delay_den
                fcTL_view.setUint8(32, 0); // dispose_op
                fcTL_view.setUint8(33, 0); // blend_op
                fcTL_view.setUint32(34, this._$crc(fcTL, 4, 4 + 26));
                chunks.push(fcTL.buffer);

                // parse PNG chunks
                const length = reader.result.byteLength;
                for (;;) {

                    const chunkLen = view.getUint32(pos);
                    if (view.getUint32(pos + 4) === 0x49444154) { // 'IDAT'

                        //add either as IDAT or fdAT chunk
                        if (!frame) {

                            //######################################
                            // add IDAT chunk
                            //######################################
                            chunks.push(reader.result.slice(pos, pos + chunkLen + 8 + 4));

                        } else {

                            //######################################
                            // add fdAT chunk
                            //######################################
                            let fdAT = new Uint8Array(4);
                            let fdAT_view = new DataView(fdAT.buffer);
                            fdAT_view.setUint32(0, chunkLen + 4);
                            chunks.push(fdAT.buffer);

                            fdAT = new Uint8Array(reader.result.slice(pos, pos + chunkLen + 8 + 4));
                            fdAT_view = new DataView(fdAT.buffer);
                            this._$writeString(fdAT, 0, "fdAT");
                            fdAT_view.setUint32(4, sequence_number++);
                            fdAT_view.setUint32(chunkLen + 8, this._$crc(fdAT, 0, chunkLen + 8)); // update crc32
                            chunks.push(fdAT.buffer);
                        }
                    }

                    // size (4 bytes) + name (4 bytes) + data + crc (4 bytes)
                    pos += chunkLen + 12;
                    if (pos >= length) {
                        break;
                    }
                }

                frame++;
                if (this._$pngs.length > frame) {

                    // handle next frame
                    reader.readAsArrayBuffer(this._$pngs[frame]);

                } else {

                    //######################################
                    // add IEND chunk 12 bytes
                    //######################################
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