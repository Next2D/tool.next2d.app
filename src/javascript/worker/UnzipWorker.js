/**
 * @type {object}
 */
const Util = {};

/**
 * @type {Uint8ArrayConstructor}
 */
Util.$Uint8Array = Uint8Array;

/**
 * @type {Uint16ArrayConstructor}
 */
Util.$Uint16Array = Uint16Array;

/**
 * @type {Int16ArrayConstructor}
 */
Util.$Int16Array = Int16Array;

/**
 * @type {ArrayBufferConstructor}
 */
Util.$ArrayBuffer = ArrayBuffer;

/**
 * @type {function}
 */
Util.$max = Math.max;
Util.$min = Math.min;

/**
 * @type {Map}
 */
Util.$potArrayBuffers = new Map();

/**
 * @type {array}
 */
Util.$codeTables = [];

/**
 * @param  {Uint16Array} keys
 * @param  {Uint16Array} values
 * @return {object}
 * @static
 */
Util.$getCodeTable = function (keys, values)
{
    const codeTable = Util.$codeTables.pop() || { "key": null, "value": null };
    codeTable.key   = keys;
    codeTable.value = values;
    return codeTable;
};

/**
 * @return {array}
 * @static
 */
Util.$poolCodeTable = function (code_table)
{
    Util.$codeTables.push(code_table);
};

/**
 * @param  {Uint8Array} array
 * @return void
 */
Util.$poolTypedArrayBuffer = function (array)
{
    const buffer = array.buffer;
    const byteLength = buffer.byteLength;
    if (!byteLength || byteLength !== Util.$upperPowerOfTwo(byteLength)) {
        return;
    }

    let buffers = Util.$potArrayBuffers.get(byteLength);
    if (!buffers) {
        buffers = [];
        Util.$potArrayBuffers.set(byteLength, buffers);
    }

    buffers.push(buffer);
};

/**
 * @param {number} v
 * @return {number}
 */
Util.$upperPowerOfTwo = function (v)
{
    v--;
    v |= v >> 1;
    v |= v >> 2;
    v |= v >> 4;
    v |= v >> 8;
    v |= v >> 16;
    v++;
    return v;
};

/**
 * @param  {uint} length
 * @return {Uint8Array}
 */
Util.$getUint8Array = function (length)
{
    let uint8Array;

    const pot = Util.$upperPowerOfTwo(length);
    const buffers = Util.$potArrayBuffers.get(pot);
    const buffer = buffers && buffers.pop();
    if (buffer) {
        uint8Array = new Util.$Uint8Array(buffer, 0, length);
        uint8Array.fill(0);
    } else {
        uint8Array = new Util.$Uint8Array(new Util.$ArrayBuffer(pot), 0, length);
    }

    return uint8Array;
};

/**
 * @param  {uint} length
 * @return {Uint16Array}
 */
Util.$getUint16Array = function (length)
{
    let uint16Array;

    const pot = Util.$upperPowerOfTwo(length * 2);
    const buffers = Util.$potArrayBuffers.get(pot);
    const buffer = buffers && buffers.pop();
    if (buffer) {
        uint16Array = new Util.$Uint16Array(buffer, 0, length);
        uint16Array.fill(0);
    } else {
        uint16Array = new Util.$Uint16Array(new Util.$ArrayBuffer(pot), 0, length);
    }

    return uint16Array;
};

/**
 * @returns {object}
 */
Util.$fixedDistTable = {
    "key": new Util.$Uint16Array([
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5
    ]),
    "value": new Util.$Uint16Array([
        0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10, 11, 12, 13, 14, 15,
        16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31
    ])
};

/**
 * @returns {object}
 */
Util.$fixedLitTable = {
    "key": new Util.$Uint16Array([
        7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
        8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
        8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
        8,8,8,8,8,8,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,
        9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,
        9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9
    ]),
    "value": new Util.$Uint16Array([
        256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
        21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,
        55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,
        89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,
        117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,
        142,143,280,281,282,283,284,285,286,287,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,
        159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,
        184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,
        209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,
        234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255
    ])
};

/**
 * @type {Uint8Array}
 */
Util.$ORDER = new Util.$Uint8Array([
    16, 17, 18, 0, 8, 7, 9, 6, 10, 5,
    11, 4, 12, 3, 13, 2, 14, 1, 15
]);

/**
 * @type {Uint8Array}
 */
Util.$LEXT = new Util.$Uint8Array([
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,
    3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 99, 99
]);

/**
 * @type {Int16Array}
 */
Util.$LENS = new Util.$Int16Array([
    3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
    35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258,
    0, 0
]);

/**
 * @type {Uint8Array}
 */
Util.$DEXT = new Util.$Uint8Array([
    0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6,
    7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13
]);

/**
 * @type {Int16Array}
 */
Util.$DISTS = new Util.$Int16Array([
    1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385,
    513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577
]);

/**
 * @class
 */
class ByteStream
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.initialization();
    }

    /**
     * @return void
     * @public
     */
    initialization ()
    {
        this.data        = null;
        this.bit_offset  = 0;
        this.byte_offset = 0;
        this.bit_buffer  = null;
    }

    /**
     * @returns void
     */
    byteAlign ()
    {
        if (!this.bit_offset) {
            return;
        }

        this.byte_offset = this.byte_offset + (this.bit_offset + 7) / 8 | 0;
        this.bit_offset  = 0;
    }

    /**
     * @param   {number} length
     * @returns {Uint8Array}
     */
    getData (length)
    {
        this.byteAlign();

        const offset = this.byte_offset + length;
        const array  = this.data.slice(this.byte_offset, offset);

        this.byte_offset = offset;

        return array;
    }

    /**
     * @param   {number} byte_int
     * @param   {number} bit_int
     * @returns void
     */
    setOffset (byte_int, bit_int)
    {
        this.byte_offset = byte_int;
        this.bit_offset  = bit_int;
    }

    /**
     * @param  {Uint8Array} data
     * @param  {uint} [index=0]
     * @return void
     * @public
     */
    unzip (data, index = 0)
    {
        let arrayIdx = index;
        const codeLengths = Util.$getUint8Array(19);

        let distTable = null;
        let litTable  = null;

        // start
        for (;;) {

            const flag = this.readUB(1);
            const type = this.readUB(2);

            // object pool
            if (distTable) {
                Util.$poolCodeTable(distTable);
                Util.$poolCodeTable(litTable);
            }

            // reset
            distTable = null;
            litTable  = null;

            if (type) {

                if (type === 1) {

                    distTable = Util.$fixedDistTable;
                    litTable  = Util.$fixedLitTable;

                } else {

                    const numLitLengths  = this.readUB(5) + 257;
                    const numDistLengths = this.readUB(5) + 1;
                    const numCodeLengths = this.readUB(4) + 4;

                    for (let i = 0; i < numCodeLengths; ++i) {
                        codeLengths[Util.$ORDER[i]] = this.readUB(3);
                    }

                    const codeTable = this.buildHuffTable(codeLengths);
                    codeLengths.fill(0);

                    const maxLengths = numLitLengths + numDistLengths | 0;
                    const litLengths = Util.$getUint8Array(maxLengths);

                    let prevCodeLen = 0;
                    for (let idx = 0; idx < maxLengths;) {

                        const sym = this.decodeSymbol(codeTable.key, codeTable.value);

                        switch (sym) {

                            case 0:
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                            case 5:
                            case 6:
                            case 7:
                            case 8:
                            case 9:
                            case 10:
                            case 11:
                            case 12:
                            case 13:
                            case 14:
                            case 15:
                                litLengths[idx++] = sym;
                                prevCodeLen = sym;
                                break;

                            case 16:
                                {
                                    let i16 = this.readUB(2) + 3 | 0;
                                    while (i16) {
                                        --i16;
                                        litLengths[idx++] = prevCodeLen;
                                    }
                                }

                                break;

                            case 17:
                                {
                                    let i17 = this.readUB(3) + 3 | 0;
                                    while (i17) {
                                        --i17;
                                        litLengths[idx++] = 0;
                                    }
                                }
                                break;

                            case 18:
                                {
                                    let i18 = this.readUB(7) + 11 | 0;
                                    while (i18) {
                                        --i18;
                                        litLengths[idx++] = 0;
                                    }
                                }
                                break;

                            default:
                                break;

                        }
                    }

                    // object pool
                    Util.$poolCodeTable(codeTable);

                    distTable = this.buildHuffTable(litLengths.subarray(numLitLengths));
                    litTable  = this.buildHuffTable(litLengths.subarray(0, numLitLengths));

                    // pool
                    Util.$poolTypedArrayBuffer(litLengths);
                    Util.$poolTypedArrayBuffer(codeTable.key);
                    Util.$poolTypedArrayBuffer(codeTable.value);
                }

                for (;;) {

                    const sym = this.decodeSymbol(litTable.key, litTable.value) | 0;
                    if (sym === 256) {
                        break;
                    }

                    if (sym < 256) {

                        data[arrayIdx++] = sym;

                    } else {

                        const mapIdx = sym - 257 | 0;
                        let length   = Util.$LENS[mapIdx] + this.readUB(Util.$LEXT[mapIdx]) | 0;

                        const distMap = this.decodeSymbol(distTable.key, distTable.value);
                        const dist    = Util.$DISTS[distMap] + this.readUB(Util.$DEXT[distMap]) | 0;

                        let i = arrayIdx - dist | 0;
                        while (length) {

                            --length;

                            data[arrayIdx++] = data[i++];

                        }
                    }
                }

            } else {

                // reset
                this.bit_offset = 8;
                this.bit_buffer = null;

                const limit = this.readNumber(2) | 0;

                // nlen
                this.byte_offset += 2;

                for (let i = 0; i < limit; ++i) {
                    data[arrayIdx++] = this.readNumber(1);
                }

            }

            if (flag) {
                break;
            }

        }

        Util.$poolTypedArrayBuffer(codeLengths);

    }

    /**
     * @param   {Uint8Array} data
     * @returns {object}
     */
    buildHuffTable (data)
    {
        const length   = data.length;
        const maxBits  = Util.$max.apply(null, data);
        const blCount  = Util.$getUint8Array(maxBits);
        const nextCode = Util.$getUint16Array(maxBits + 1);

        let code     = 0;
        let idx      = 0;

        let i = length;
        while (i) {

            idx = data[--i];

            if (idx) {
                ++blCount[idx];
            }

        }

        let maxCode = 0;
        for (let idx = 0; idx < maxBits; ) {

            code = code + blCount[idx++] << 1;

            nextCode[idx] = code;

            maxCode = Util.$max(maxCode, code);

        }

        const maxKey = maxCode + length;
        const keys   = Util.$getUint16Array(maxKey);
        const values = Util.$getUint16Array(maxKey);
        for (let i = 0; i < length; ++i) {

            idx = data[i];

            if (idx) {

                const nCode = nextCode[idx];

                keys[nCode]   = idx;
                values[nCode] = i;

                nextCode[idx] = nCode + 1 | 0;

            }
        }

        // object pool
        Util.$poolTypedArrayBuffer(blCount);
        Util.$poolTypedArrayBuffer(nextCode);

        return Util.$getCodeTable(keys, values);
    }

    /**
     * @param   {Uint16Array} keys
     * @param   {Uint16Array} value
     * @returns {number}
     */
    decodeSymbol (keys, value)
    {
        let code   = 0;
        let length = 0;
        for (;;) {
            code = code << 1 | this.readUB(1);

            ++length;
            if (keys[code] === length) {
                return value[code];
            }
        }
    }

    /**
     * @param   {number} length
     * @returns {number}
     */
    readUB (length)
    {
        let value = 0;
        for (let idx = 0; idx < length; ++idx) {

            if (this.bit_offset === 8) {
                this.bit_buffer = this.readNumber(1);
                this.bit_offset = 0;
            }

            value |= (this.bit_buffer & 0x01 << this.bit_offset++ ? 1 : 0) << idx;

        }
        return value;
    }

    /**
     * @param   {number} n
     * @returns {number}
     */
    readNumber (n)
    {
        let value = 0;

        const o = this.byte_offset;
        let i = o + n | 0;
        while (i > o) {
            value = value << 8 | this.data[--i];
        }

        this.byte_offset += n;

        return value;
    }
}

// set
Util.$byteStream = new ByteStream();

/**
 * @param  {Uint8Array} data
 * @param  {uint}       width
 * @param  {uint}       height
 * @param  {uint}       format
 * @param  {uint}       table_size
 * @param  {boolean}    is_alpha
 * @return {Uint8Array}
 * @static
 */
Util.$lossless = function (
    data, width, height, format, table_size, is_alpha
) {

    const pixels = new Util.$Uint8Array(width * height * 4);
    if (format === 3) {

        const pad = (width + 3 & -4) - width;
        let idx   = 0;
        if (is_alpha) {

            let index = table_size * 4;
            for (let y = 0; y < height; ++y) {

                for (let x = 0; x < width; ++x) {

                    const colorIndex = data[index++] * 4;

                    const a = data[colorIndex + 3];

                    if (a === 0) {
                        pixels[idx++] = 0;
                        pixels[idx++] = 0;
                        pixels[idx++] = 0;
                        pixels[idx++] = 0;
                        continue;
                    }

                    const r = data[colorIndex    ];
                    const g = data[colorIndex + 1];
                    const b = data[colorIndex + 2];
                    if (a === 255) {
                        pixels[idx++] = r;
                        pixels[idx++] = g;
                        pixels[idx++] = b;
                        pixels[idx++] = a;
                        continue;
                    }

                    pixels[idx++] = Util.$min(r / a * 255, 255) & 0xff;
                    pixels[idx++] = Util.$min(g / a * 255, 255) & 0xff;
                    pixels[idx++] = Util.$min(b / a * 255, 255) & 0xff;
                    pixels[idx++] = a;

                }

                index += pad;

            }

            return pixels;
        }

        let index = table_size * 3;
        for (let y = 0; y < height; ++y) {

            for (let x = 0; x < width; ++x) {

                const colorIndex = data[index++] * 3;

                pixels[idx++] = data[colorIndex    ];
                pixels[idx++] = data[colorIndex + 1];
                pixels[idx++] = data[colorIndex + 2];
                pixels[idx++] = 255;

            }

            index += pad;
        }

        return pixels;
    }

    const area = width * height;
    if (is_alpha) {

        for (let idx = 0; idx < area; ++idx) {

            const pxIdx = idx * 4;

            const aIdx  = pxIdx;
            const bIdx  = pxIdx + 1;
            const cIdx  = pxIdx + 2;
            const dIdx  = pxIdx + 3;

            const alpha = data[aIdx];
            if (alpha === 0) {
                pixels[aIdx] = 0;
                pixels[bIdx] = 0;
                pixels[cIdx] = 0;
                pixels[dIdx] = 0;
                continue;
            }

            if (alpha === 255) {
                pixels[aIdx] = data[bIdx];
                pixels[bIdx] = data[cIdx];
                pixels[cIdx] = data[dIdx];
                pixels[dIdx] = alpha;
                continue;
            }

            pixels[aIdx] = Util.$min(data[bIdx] / alpha * 255, 255) & 0xff;
            pixels[bIdx] = Util.$min(data[cIdx] / alpha * 255, 255) & 0xff;
            pixels[cIdx] = Util.$min(data[dIdx] / alpha * 255, 255) & 0xff;
            pixels[dIdx] = alpha;
        }

        return pixels;
    }

    for (let idx = 0; idx < area; ++idx) {

        const pxIdx = idx * 4;

        const aIdx  = pxIdx;
        const bIdx  = pxIdx + 1;
        const cIdx  = pxIdx + 2;
        const dIdx  = pxIdx + 3;

        pixels[aIdx] = data[bIdx];
        pixels[bIdx] = data[cIdx];
        pixels[cIdx] = data[dIdx];
        pixels[dIdx] = 255;

    }

    return pixels;
};

/**
 * @see Util.$unzipWorker
 */
this.addEventListener("message", function (event)
{
    // setup
    const byteStream = Util.$byteStream;
    switch (event.data.mode) {

        case "swf":
            {
                byteStream.data = event.data.buffer;

                const fileSize = event.data.fileSize;
                const buffer   = new Util.$Uint8Array(fileSize);

                const header = byteStream.getData(8);
                byteStream.setOffset(10, 8);

                buffer.set(header, 0);
                byteStream.unzip(buffer, 8);

                // return
                this.postMessage({
                    "buffer": buffer,
                    "mode": event.data.mode
                }, [buffer.buffer]);
            }
            break;

        case "lossless":
            {
                const character = event.data;
                const buffer = new Util.$Uint8Array(character.fileSize);

                byteStream.data = event.data.buffer;
                byteStream.setOffset(2, 8);
                byteStream.unzip(buffer, 0);

                const pixels = Util.$lossless(
                    buffer, character.width, character.height,
                    character.format, character.tableSize,
                    character.isAlpha
                );

                // return
                this.postMessage({
                    "buffer": pixels,
                    "mode": event.data.mode
                }, [pixels.buffer]);

            }
            break;

        case "jpegAlpha":
            {
                const fileSize = event.data.width * event.data.height;
                const buffer = new Util.$Uint8Array(fileSize);

                byteStream.data = event.data.alphaData;
                byteStream.setOffset(2, 8);
                byteStream.unzip(buffer, 0);

                // set buffer
                event.data.alphaData = buffer;
                this.postMessage(event.data, [
                    event.data.buffer.buffer,
                    event.data.alphaData.buffer
                ]);
            }
            break;

        default:
            break;

    }

    // reset
    Util.$byteStream.initialization();
});
