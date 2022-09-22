/**
 * @class
 * @memberOf parser
 */
class ByteStream
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this._$buffer     = null;
        this._$bitOffset  = 0;
        this._$byteOffset = 0;
    }

    /**
     * @param   {Uint8Array} data
     * @returns {void}
     */
    setData (data)
    {
        this._$buffer = data;
    }

    /**
     * @param   {number} length
     * @returns {Uint8Array}
     */
    getData (length)
    {
        this.byteAlign();

        const offset = this._$byteOffset + length;
        const array  = this._$buffer.slice(this._$byteOffset, offset);

        this._$byteOffset = offset;

        return array;
    }

    /**
     * @returns {string}
     */
    getHeaderSignature ()
    {
        let signature = "";

        let count = 3;
        while (count) {

            const code = this.getUI8();
            switch (code) {

                // trim
                case 32:
                case 96:
                case 127:
                    continue;

                default:
                    break;

            }

            signature += String.fromCharCode(code);

            --count;

        }

        return signature;
    }

    /**
     * @returns {number}
     */
    getVersion ()
    {
        return this.getUI8();
    }

    /**
     * @returns void
     */
    byteAlign ()
    {
        if (!this._$bitOffset) {
            return;
        }

        this._$byteOffset = this._$byteOffset + (this._$bitOffset + 7) / 8 | 0;
        this._$bitOffset  = 0;
    }

    /**
     * @returns void
     */
    byteCarry ()
    {
        if (this._$bitOffset > 7) {
            this._$byteOffset  = this._$byteOffset + (0 | (this._$bitOffset + 7) / 8);
            this._$bitOffset  &= 0x07;
        } else {
            while (this._$bitOffset < 0) {
                --this._$byteOffset;
                this._$bitOffset += 8;
            }
        }
    }

    /**
     * @param   {number} number
     * @returns {number}
     */
    getUIBits (number)
    {
        let value = 0;
        while (number) {

            value <<= 1;
            value |= this.getUIBit();

            --number;
        }
        return value;
    }

    /**
     * @returns {number}
     */
    getUIBit ()
    {
        this.byteCarry();
        return this._$buffer[this._$byteOffset] >> 7 - this._$bitOffset++ & 0x1;
    }

    /**
     * @param   {number} number
     * @returns {number}
     */
    getSIBits (number)
    {
        const value = this.getUIBits(number);
        const msb   = value & 0x1 << number - 1;
        if (msb) {
            return -(value ^ 2 * msb - 1) - 1;
        }
        return value;
    }

    /**
     * @returns {number}
     */
    getUI8 ()
    {
        this.byteAlign();
        return this._$buffer[this._$byteOffset++];
    }

    /**
     * @returns {number}
     */
    getUI16 ()
    {
        this.byteAlign();
        return this.getUI8() | this.getUI8() << 8;
    }

    /**
     * @returns {number}
     */
    getUI32 ()
    {
        this.byteAlign();
        return this.getUI8() | (this.getUI8()
            | (this.getUI8() | this.getUI8() << 8) << 8) << 8;
    }
}
