/**
 * @type {object}
 */
const LZMA = {};

/**
 * @param  {Uint8Array} data
 * @return {Uint8Array}
 */
LZMA.init = function (data)
{
    const diff = [];

    diff.push(
        data[12], data[13], data[14],
        data[15], data[16], data[4],
        data[5],  data[6],  data[7]
    );

    let c = 8;
    for (let idx = 5; idx < 9; ++idx) {

        if (diff[idx] >= c) {
            diff[idx] = diff[idx] - c | 0;
            break;
        }

        diff[idx] = 256 + diff[idx] - c | 0;

        c = 1;
    }

    diff.push(0, 0, 0, 0);
    data.set(diff, 4);

    return data.subarray(4);
};

/**
 * @param  {Uint8Array} models
 * @param  {uint} start_index
 * @param  {RangeDecoder} range_decoder
 * @param  {uint} num_bit_levels
 * @return {number}
 * @static
 */
LZMA.reverseDecode2 = function (models, start_index, range_decoder, num_bit_levels)
{
    let m = 1;
    let symbol = 0;
    let i = 0;

    for (; i < num_bit_levels; ++ i) {

        const bit = range_decoder.decodeBit(models, start_index + m);

        m = m << 1 | bit;

        symbol |= bit << i;
    }

    return symbol;
};

/**
 * @param  {InStream}  inStream
 * @param  {OutStream} outStream
 * @return {OutStream}
 * @static
 */
LZMA.decompress = function (inStream, outStream)
{
    const decoder = new Decoder();
    const header  = decoder.decodeHeader(inStream);
    const maxSize = header.uncompressedSize;
    decoder.setProperties(header);

    if (!decoder.decodeBody(inStream, outStream, maxSize)) {
        throw new Error("Error in lzma data stream");
    }

    return outStream;
};

/**
 * @class
 */
class OutWindow
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this._buffer     = null;
        this._stream     = null;
        this._pos        = 0;
        this._streamPos  = 0;
        this._windowSize = 0;
    }

    /**
     * @param  {uint} window_size
     * @return void
     * @public
     */
    create (window_size)
    {
        // check
        if (!this._buffer || this._windowSize !== window_size ) {
            this._buffer = new Uint8Array(window_size);
        }
        this._windowSize = window_size;
    }

    /**
     * @return void
     * @public
     */
    flush ()
    {
        const size = this._pos - this._streamPos;
        if (size) {

            this._stream.writeBytes(this._buffer, size);

            if (this._pos >= this._windowSize) {
                this._pos = 0;
            }

            this._streamPos = this._pos;
        }
    }

    /**
     * @return void
     * @public
     */
    releaseStream ()
    {
        this.flush();
        this._stream = null;
    }

    /**
     * @param  {object} stream
     * @return void
     * @public
     */
    setStream (stream)
    {
        this._stream = stream;
    }

    /**
     * @param  {boolean} solid
     * @return void
     * @public
     */
    init (solid = false)
    {
        if (!solid) {
            this._streamPos = 0;
            this._pos       = 0;
        }
    }

    /**
     * @param  {uint} distance
     * @param  {uint} length
     * @return void
     * @public
     */
    copyBlock (distance, length)
    {
        let pos = this._pos - distance - 1;
        if (pos < 0) {
            pos += this._windowSize;
        }

        while (length--) {

            if (pos >= this._windowSize) {
                pos = 0;
            }

            this._buffer[this._pos++] = this._buffer[pos++];
            if (this._pos >= this._windowSize) {
                this.flush();
            }
        }
    }

    /**
     * @param  {uint} byte
     * @return void
     * @public
     */
    putByte (byte)
    {
        this._buffer[this._pos++] = byte;
        if (this._pos >= this._windowSize) {
            this.flush();
        }
    }

    /**
     * @param  {uint} distance
     * @return {uint}
     * @public
     */
    getByte (distance)
    {
        let pos = this._pos - distance - 1;
        if (pos < 0) {
            pos += this._windowSize;
        }
        return this._buffer[pos];
    }
}

/**
 * @class
 */
class RangeDecoder
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this._stream = null;
        this._code   = 0;
        this._range  = -1;
    }

    /**
     * @return void
     * @public
     */
    setStream (stream)
    {
        this._stream = stream;
    }

    /**
     * @return void
     * @public
     */
    releaseStream ()
    {
        this._stream = null;
    }

    /**
     * @return void
     * @public
     */
    init ()
    {
        let i = 5;

        this._code  = 0;
        this._range = -1;

        while (i--) {
            this._code = this._code << 8 | this._stream.readByte();
        }
    }

    /**
     * @param  {number} num_total_bits
     * @return {number}
     * @public
     */
    decodeDirectBits (num_total_bits)
    {
        let result = 0;
        let i = num_total_bits;

        while (i--) {

            this._range >>>= 1;
            const t = this._code - this._range >>> 31;
            this._code -= this._range & t - 1;
            result = result << 1 | 1 - t;

            if ((this._range & 0xff000000) === 0) {
                this._code = this._code << 8 | this._stream.readByte();
                this._range <<= 8;
            }
        }

        return result;
    }

    /**
     * @param  {Uint8Array} probs
     * @param  {uint} index
     * @return {uint}
     * @public
     */
    decodeBit (probs, index)
    {
        const prob = probs[index];

        const newBound = (this._range >>> 11) * prob;

        if ((this._code ^ 0x80000000) < (newBound ^ 0x80000000)) {

            this._range = newBound;

            probs[index] += 2048 - prob >>> 5;
            if ((this._range & 0xff000000) === 0) {
                this._code = this._code << 8 | this._stream.readByte();
                this._range <<= 8;
            }

            return 0;
        }

        this._range  -= newBound;
        this._code   -= newBound;
        probs[index] -= prob >>> 5;
        if ((this._range & 0xff000000) === 0) {
            this._code = this._code << 8 | this._stream.readByte();
            this._range <<= 8;
        }

        return 1;
    }
}

/**
 * @class
 */
class BitTreeDecoder
{
    /**
     * @constructor
     * @param {uint} num_bit_levels
     * @public
     */
    constructor (num_bit_levels)
    {
        this._models       = Array(1 << num_bit_levels).fill(1024);
        this._numBitLevels = num_bit_levels;
    }

    /**
     * @param  {RangeDecoder} range_decoder
     * @return {number}
     * @public
     */
    decode (range_decoder)
    {
        let m = 1;
        let i = this._numBitLevels;

        while (i--) {
            m = m << 1 | range_decoder.decodeBit(this._models, m);
        }

        return m - (1 << this._numBitLevels);
    }

    /**
     * @param  {RangeDecoder} range_decoder
     * @return {number}
     * @public
     */
    reverseDecode (range_decoder)
    {
        let m = 1;
        let symbol = 0;
        let i = 0;

        for (; i < this._numBitLevels; ++i) {

            const bit = range_decoder.decodeBit(this._models, m);

            m = m << 1 | bit;

            symbol |= bit << i;
        }

        return symbol;
    }
}

/**
 * @class
 */
class LenDecoder
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this._choice       = [1024, 1024];
        this._lowCoder     = [];
        this._midCoder     = [];
        this._highCoder    = new BitTreeDecoder(8);
        this._numPosStates = 0;
    }

    /**
     * @param {uint} num_pos_states
     * @return void
     * @public
     */
    create (num_pos_states)
    {
        for (; this._numPosStates < num_pos_states; ++this._numPosStates) {
            this._lowCoder[this._numPosStates] = new BitTreeDecoder(3);
            this._midCoder[this._numPosStates] = new BitTreeDecoder(3);
        }
    }

    /**
     * @param  {RangeDecoder} range_decoder
     * @param  {uint} pos_state
     * @return {number}
     */
    decode (range_decoder, pos_state)
    {
        if (range_decoder.decodeBit(this._choice, 0) === 0) {
            return this._lowCoder[pos_state].decode(range_decoder);
        }

        if (range_decoder.decodeBit(this._choice, 1) === 0) {
            return 8 + this._midCoder[pos_state].decode(range_decoder);
        }

        return 16 + this._highCoder.decode(range_decoder);
    }
}

/**
 * @class
 */
class Decoder2
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this._decoders = Array(0x300).fill(1024);
    }

    /**
     * @param  {RangeDecoder} range_decoder
     * @return {number}
     * @public
     */
    decodeNormal (range_decoder)
    {
        let symbol = 1;

        do {

            symbol = symbol << 1 | range_decoder.decodeBit(this._decoders, symbol);

        } while (symbol < 0x100);

        return symbol & 0xff;
    }

    /**
     *
     * @param  {RangeDecoder} range_decoder
     * @param  {uint} match_byte
     * @return {number}
     * @public
     */
    decodeWithMatchByte (range_decoder, match_byte)
    {
        let symbol = 1;

        do {

            const matchBit = match_byte >> 7 & 1;

            match_byte <<= 1;

            const bit = range_decoder.decodeBit(this._decoders, (1 + matchBit << 8) + symbol);

            symbol = symbol << 1 | bit;
            if (matchBit !== bit) {
                while (symbol < 0x100) {
                    symbol = symbol << 1 | range_decoder.decodeBit(this._decoders, symbol);
                }
                break;
            }

        } while (symbol < 0x100);

        return symbol & 0xff;
    }
}

/**
 * @class
 */
class LiteralDecoder
{

    /**
     * @param  {uint} num_pos_bits
     * @param  {uint} num_prev_bits
     * @return void
     * @public
     */
    create (num_pos_bits, num_prev_bits)
    {
        if (this._coders
            && this._numPrevBits === num_prev_bits
            && this._numPosBits  === num_pos_bits
        ) {
            return;
        }

        this._numPosBits  = num_pos_bits;
        this._posMask     = (1 << num_pos_bits) - 1;
        this._numPrevBits = num_prev_bits;

        this._coders = [];

        let i = 1 << this._numPrevBits + this._numPosBits;
        while (i--) {
            this._coders[i] = new Decoder2();
        }
    }

    /**
     * @param  {uint} pos
     * @param  {uint} prev_byte
     * @return {Decoder2}
     */
    getDecoder (pos, prev_byte)
    {
        return this._coders[((pos & this._posMask) << this._numPrevBits)
        + ((prev_byte & 0xff) >>> 8 - this._numPrevBits)];
    }
}

/**
 * @class
 */
class Decoder
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this._outWindow           = new OutWindow();
        this._rangeDecoder        = new RangeDecoder();
        this._isMatchDecoders     = Array(192).fill(1024);
        this._isRepDecoders       = Array(12).fill(1024);
        this._isRepG0Decoders     = Array(12).fill(1024);
        this._isRepG1Decoders     = Array(12).fill(1024);
        this._isRepG2Decoders     = Array(12).fill(1024);
        this._isRep0LongDecoders  = Array(192).fill(1024);
        this._posDecoders         = Array(114).fill(1024);
        this._posAlignDecoder     = new BitTreeDecoder(4);
        this._lenDecoder          = new LenDecoder();
        this._repLenDecoder       = new LenDecoder();
        this._literalDecoder      = new LiteralDecoder();
        this._dictionarySize      = -1;
        this._dictionarySizeCheck = -1;

        this._posSlotDecoder = [
            new BitTreeDecoder(6), new BitTreeDecoder(6),
            new BitTreeDecoder(6), new BitTreeDecoder(6)
        ] ;
    }

    /**
     * @param  {int} dictionary_size
     * @return {boolean}
     * @public
     */
    setDictionarySize (dictionary_size)
    {
        if (dictionary_size < 0) {
            return false;
        }

        if (this._dictionarySize !== dictionary_size) {

            this._dictionarySize = dictionary_size;

            this._dictionarySizeCheck = Math.max(this._dictionarySize, 1);
            this._outWindow.create(Math.max(this._dictionarySizeCheck, 4096));
        }

        return true;
    }

    /**
     * @param  {uint} lc
     * @param  {uint} lp
     * @param  {uint} pb
     * @return {boolean}
     * @public
     */
    setLcLpPb (lc, lp, pb)
    {
        if (lc > 8 || lp > 4 || pb > 4) {
            return false;
        }

        const numPosStates = 1 << pb;
        this._literalDecoder.create(lp, lc);

        this._lenDecoder.create(numPosStates);
        this._repLenDecoder.create(numPosStates);

        this._posStateMask = numPosStates - 1;

        return true;
    }

    /**
     * @param  {object} props
     * @return void
     * @public
     */
    setProperties (props)
    {
        if (!this.setLcLpPb(props.lc, props.lp, props.pb)) {
            throw Error("Incorrect stream properties");
        }

        if (!this.setDictionarySize(props.dictionarySize)) {
            throw Error("Invalid dictionary size");
        }
    }

    /**
     * @param  {object} in_stream
     * @return {object}
     * @public
     */
    decodeHeader (in_stream)
    {
        if (in_stream._$size < 13) {
            return false;
        }

        let properties = in_stream.readByte();
        const lc = properties % 9;
        properties = ~~(properties / 9);
        const lp = properties % 5;
        const pb = ~~(properties / 5);

        let dictionarySize = in_stream.readByte();
        dictionarySize    |= in_stream.readByte() << 8;
        dictionarySize    |= in_stream.readByte() << 16;
        dictionarySize    += in_stream.readByte() * 16777216;

        let uncompressedSize = in_stream.readByte();
        uncompressedSize    |= in_stream.readByte() << 8;
        uncompressedSize    |= in_stream.readByte() << 16;
        uncompressedSize    += in_stream.readByte() * 16777216;

        in_stream.readByte();
        in_stream.readByte();
        in_stream.readByte();
        in_stream.readByte();

        return {
            "lc": lc,
            "lp": lp,
            "pb": pb,
            "dictionarySize": dictionarySize,
            "uncompressedSize": uncompressedSize
        };
    }

    /**
     * @param  {object} in_stream
     * @param  {object} out_stream
     * @param  {uint} max_size
     * @return {boolean}
     * @public
     */
    decodeBody (in_stream, out_stream, max_size)
    {
        let state = 0, rep0 = 0, rep1 = 0, rep2 = 0, rep3 = 0,
            nowPos64 = 0, prevByte = 0, len, distance;

        this._rangeDecoder.setStream(in_stream);
        this._rangeDecoder.init();

        this._outWindow.setStream(out_stream);
        this._outWindow.init(false);

        while (nowPos64 < max_size) {

            const posState = nowPos64 & this._posStateMask;

            if (this._rangeDecoder.decodeBit(this._isMatchDecoders, (state << 4) + posState) === 0) {

                const decoder2 = this._literalDecoder.getDecoder(nowPos64++, prevByte);

                prevByte = state >= 7
                    ? decoder2.decodeWithMatchByte(this._rangeDecoder, this._outWindow.getByte(rep0))
                    : decoder2.decodeNormal(this._rangeDecoder);

                this._outWindow.putByte(prevByte);

                state = state < 4 ? 0 : state - (state < 10 ? 3 : 6);

            } else {

                if (this._rangeDecoder.decodeBit(this._isRepDecoders, state) === 1) {

                    len = 0;
                    if (this._rangeDecoder.decodeBit(this._isRepG0Decoders, state) === 0) {

                        if (this._rangeDecoder.decodeBit(this._isRep0LongDecoders, (state << 4) + posState) === 0) {
                            state = state < 7 ? 9 : 11;
                            len = 1;
                        }

                    } else {

                        if (this._rangeDecoder.decodeBit(this._isRepG1Decoders, state) === 0) {

                            distance = rep1;

                        } else {

                            if (this._rangeDecoder.decodeBit(this._isRepG2Decoders, state) === 0) {

                                distance = rep2;

                            } else {

                                distance = rep3;
                                rep3 = rep2;

                            }

                            rep2 = rep1;
                        }

                        rep1 = rep0;
                        rep0 = distance;
                    }

                    if (len === 0) {
                        len = 2 + this._repLenDecoder.decode(this._rangeDecoder, posState);
                        state = state < 7 ? 8 : 11;
                    }

                } else {

                    rep3 = rep2;
                    rep2 = rep1;
                    rep1 = rep0;

                    len = 2 + this._lenDecoder.decode(this._rangeDecoder, posState);
                    state = state < 7 ? 7 : 10;

                    const posSlot = this._posSlotDecoder[len <= 5 ? len - 2 : 3].decode(this._rangeDecoder);
                    if (posSlot >= 4) {

                        const numDirectBits = (posSlot >> 1) - 1;
                        rep0 = (2 | posSlot & 1) << numDirectBits;

                        if (posSlot < 14) {

                            rep0 += LZMA.reverseDecode2(this._posDecoders,
                                rep0 - posSlot - 1, this._rangeDecoder, numDirectBits);

                        } else {

                            rep0 += this._rangeDecoder.decodeDirectBits(numDirectBits - 4) << 4;
                            rep0 += this._posAlignDecoder.reverseDecode(this._rangeDecoder);

                            if (rep0 < 0) {
                                if (rep0 === -1) {
                                    break;
                                }
                                return false;
                            }

                        }

                    } else {

                        rep0 = posSlot;

                    }

                }

                if (rep0 >= nowPos64 || rep0 >= this._dictionarySizeCheck) {
                    return false;
                }

                this._outWindow.copyBlock(rep0, len);
                nowPos64 += len;
                prevByte = this._outWindow.getByte(0);

            }

        }

        // end
        this._outWindow.releaseStream();
        this._rangeDecoder.releaseStream();

        return true;
    }

}

/**
 * @class
 */
class InStream
{
    /**
     * @constructor
     * @public
     */
    constructor (uint8_array)
    {
        this._$data   = uint8_array;
        this._$size   = uint8_array.length;
        this._$offset = 0;
    }

    /**
     * @return {uint}
     * @public
     */
    readByte ()
    {
        return this._$data[this._$offset++];
    }
}

/**
 * @class
 */
class OutStream
{
    /**
     * @param {Uint8Array} buffers
     * @constructor
     * @public
     */
    constructor (buffers)
    {
        this.size    = 8;
        this.buffers = buffers;
    }

    /**
     * @param  {Uint8Array} buffer
     * @param  {uint} size
     * @return void
     * @public
     */
    writeBytes (buffer, size)
    {
        if (buffer.length === size) {
            this.buffers.set(buffer, this.size);
        } else {
            this.buffers.set(buffer.subarray(0, size), this.size);
        }
        this.size += size;
    }
}

/**
 * @see Util.$unlzmaWorkerURL
 */
this.addEventListener("message", function (event)
{
    const fileSize   = event.data.fileSize;
    const compressed = event.data.buffer;

    const data = new Uint8Array(fileSize + 8);

    data.set(compressed.slice(0, 8), 0); // header

    LZMA.decompress(
        new InStream(LZMA.init(compressed)),
        new OutStream(data)
    );

    // return
    this.postMessage(data, [data.buffer]);

    this.close();
});