/**
 * @class
 */
class SVGPathParser extends SVGTransformable
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$curNumber = "";

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$curCommandType = -1;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$curCommandRelative = false;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$canParseCommandOrComma = true;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$curNumberHasExp = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$curNumberHasExpDigits = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$curNumberHasDecimal = false;

        /**
         * @type {array}
         * @private
         */
        this._$curArgs = [];

        /**
         * @type {array}
         * @private
         */
        this._$commands = [];

        /**
         * @type {array}
         * @private
         */
        this._$transforms = [];
    }

    /**
     * @return {object}
     * @const
     * @static
     */
    static get COMMAND_ARG_COUNTS ()
    {
        return {
            [SVGCommandTypes.MOVE_TO]: 2,
            [SVGCommandTypes.LINE_TO]: 2,
            [SVGCommandTypes.HORIZ_LINE_TO]: 1,
            [SVGCommandTypes.VERT_LINE_TO]: 1,
            [SVGCommandTypes.CLOSE_PATH]: 0,
            [SVGCommandTypes.QUAD_TO]: 4,
            [SVGCommandTypes.SMOOTH_QUAD_TO]: 2,
            [SVGCommandTypes.CURVE_TO]: 6,
            [SVGCommandTypes.SMOOTH_CURVE_TO]: 4,
            [SVGCommandTypes.ARC]: 7
        };
    }

    /**
     * @param  {string} xml
     * @return {array}
     * @method
     * @public
     */
    execute (xml)
    {
        this._$commands = [];
        for (let idx = 0; idx < xml.length; idx++) {

            const c = xml[idx];

            // White spaces parsing
            const isAArcFlag = this._$curCommandType === SVGCommandTypes.ARC
                && (this._$curArgs.length === 3 || this._$curArgs.length === 4)
                && this._$curNumber.length === 1
                && (this._$curNumber === "0" || this._$curNumber === "1");

            const isEndingDigit = this.isDigit(c) && (
                this._$curNumber === "0" && c === "0"
                || isAArcFlag
            );

            if (this.isDigit(c) && !isEndingDigit) {
                this._$curNumber += c;
                this._$curNumberHasExpDigits = this._$curNumberHasExp;
                continue;
            }

            if (c === "e" || c === "E") {
                this._$curNumber += c;
                this._$curNumberHasExp = true;
                continue;
            }
            if ((c === "-" || c === "+")
                && this._$curNumberHasExp
                && !this._$curNumberHasExpDigits
            ) {
                this._$curNumber += c;
                continue;
            }

            // if we already have a ".", it means we are starting a new number
            if ("." === c && !this._$curNumberHasExp
                && !this._$curNumberHasDecimal && !isAArcFlag
            ) {
                this._$curNumber += c;
                this._$curNumberHasDecimal = true;
                continue;
            }

            // New number
            if (this._$curNumber && this._$curCommandType !== -1) {
                const val = Number(this._$curNumber);

                if (isNaN(val)) {
                    throw new Error(`Invalid number ending at ${idx}`);
                }

                if (this._$curCommandType === SVGCommandTypes.ARC) {

                    if (0 === this._$curArgs.length || 1 === this._$curArgs.length) {

                        if (0 > val) {
                            throw new Error(
                                `Expected positive number, got "${val}" at index "${idx}"`
                            );
                        }

                    }

                    if (3 === this._$curArgs.length || 4 === this._$curArgs.length) {

                        if ("0" !== this._$curNumber && "1" !== this._$curNumber) {
                            throw new Error(
                                `Expected a flag, got "${this._$curNumber}" at index "${idx}"`
                            );
                        }

                    }
                }

                this._$curArgs.push(val);
                if (this._$curArgs.length === SVGPathParser.COMMAND_ARG_COUNTS[this._$curCommandType]) {
                    this.pushCommand();
                }

                this._$curNumber = "";
                this._$curNumberHasExpDigits = false;
                this._$curNumberHasExp = false;
                this._$curNumberHasDecimal = false;
                this._$canParseCommandOrComma = true;
            }

            // Continue if a white space or a comma was detected
            if (this.isWhiteSpace(c)) {
                continue;
            }

            if (c === "," && this._$canParseCommandOrComma) {
                // L 0,0, H is not valid:
                this._$canParseCommandOrComma = false;
                continue;
            }

            // if a sign is detected, then parse the new number
            if (c === "+" || c === "-" || c === ".") {
                this._$curNumber = c;
                this._$curNumberHasDecimal = "." === c;
                continue;
            }

            // if a 0 is detected, then parse the new number
            if (isEndingDigit) {
                this._$curNumber = c;
                this._$curNumberHasDecimal = false;
                continue;
            }

            // Adding residual command
            if (0 !== this._$curArgs.length) {
                throw new Error(`Unterminated command at index ${idx}.`);
            }

            if (!this._$canParseCommandOrComma) {
                throw new Error(
                    `Unexpected character "${c}" at index ${idx}. Command cannot follow comma`
                );
            }

            this._$canParseCommandOrComma = false;

            switch (c) {

                case "z":
                case "Z":
                    this._$commands.push({
                        "type": SVGCommandTypes.CLOSE_PATH
                    });
                    this._$canParseCommandOrComma = true;
                    this._$curCommandType = -1;
                    break;

                case "h":
                case "H":
                    this._$curCommandType = SVGCommandTypes.HORIZ_LINE_TO;
                    this._$curCommandRelative = "h" === c;
                    break;

                case "v":
                case "V":
                    this._$curCommandType = SVGCommandTypes.VERT_LINE_TO;
                    this._$curCommandRelative = "v" === c;
                    break;

                case "m":
                case "M":
                    this._$curCommandType = SVGCommandTypes.MOVE_TO;
                    this._$curCommandRelative = "m" === c;
                    break;

                case "l":
                case "L":
                    this._$curCommandType = SVGCommandTypes.LINE_TO;
                    this._$curCommandRelative = "l" === c;
                    break;

                case "c":
                case "C":
                    this._$curCommandType = SVGCommandTypes.CURVE_TO;
                    this._$curCommandRelative = "c" === c;
                    break;

                case "s":
                case "S":
                    this._$curCommandType = SVGCommandTypes.SMOOTH_CURVE_TO;
                    this._$curCommandRelative = "s" === c;
                    break;

                case "q":
                case "Q":
                    this._$curCommandType = SVGCommandTypes.QUAD_TO;
                    this._$curCommandRelative = "q" === c;
                    break;

                case "t":
                case "T":
                    this._$curCommandType = SVGCommandTypes.SMOOTH_QUAD_TO;
                    this._$curCommandRelative = "t" === c;
                    break;

                case "a":
                case "A":
                    this._$curCommandType = SVGCommandTypes.ARC;
                    this._$curCommandRelative = "a" === c;
                    break;

                default:
                    throw new Error(`Unexpected character "${c}" at index ${idx}.`);

            }
        }

        if (this._$curCommandType !== -1) {
            const val = Number(this._$curNumber);

            if (!isNaN(val)) {
                this._$curArgs.push(val);
                if (this._$curArgs.length === SVGPathParser.COMMAND_ARG_COUNTS[this._$curCommandType]) {
                    this.pushCommand();
                }
            }

        }

        // 変形処理を実行
        this.executeTransform();

        return this._$commands;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    executeTransform ()
    {
        for (let idx = 0; idx < this._$transforms.length; ++idx) {

            const transform = this._$transforms[idx];

            const commands = [];
            for (let idx = 0; idx < this._$commands.length; ++idx) {

                const value = transform(this._$commands[idx]);
                if (Array.isArray(value)) {

                    commands.push(...value);

                } else {

                    commands.push(value);

                }
            }

            this._$commands = commands;
        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    pushCommand ()
    {
        switch (this._$curCommandType) {

            case SVGCommandTypes.HORIZ_LINE_TO:
                this._$commands.push({
                    "type": SVGCommandTypes.HORIZ_LINE_TO,
                    "relative": this._$curCommandRelative,
                    "x": this._$curArgs[0]
                });
                break;

            case SVGCommandTypes.VERT_LINE_TO:
                this._$commands.push({
                    "type": SVGCommandTypes.VERT_LINE_TO,
                    "relative": this._$curCommandRelative,
                    "y": this._$curArgs[0]
                });
                break;

            case SVGCommandTypes.MOVE_TO:
            case SVGCommandTypes.LINE_TO:
            case SVGCommandTypes.SMOOTH_QUAD_TO:
                this._$commands.push({
                    "type": this._$curCommandType,
                    "relative": this._$curCommandRelative,
                    "x": this._$curArgs[0],
                    "y": this._$curArgs[1]
                });

                // Switch to line to state
                if (SVGCommandTypes.MOVE_TO === this._$curCommandType) {
                    this._$curCommandType = SVGCommandTypes.LINE_TO;
                }
                break;

            case SVGCommandTypes.CURVE_TO:
                this._$commands.push({
                    "type": SVGCommandTypes.CURVE_TO,
                    "relative": this._$curCommandRelative,
                    "x1": this._$curArgs[0],
                    "y1": this._$curArgs[1],
                    "x2": this._$curArgs[2],
                    "y2": this._$curArgs[3],
                    "x": this._$curArgs[4],
                    "y": this._$curArgs[5]
                });
                break;

            case SVGCommandTypes.SMOOTH_CURVE_TO:
                this._$commands.push({
                    "type": SVGCommandTypes.SMOOTH_CURVE_TO,
                    "relative": this._$curCommandRelative,
                    "x2": this._$curArgs[0],
                    "y2": this._$curArgs[1],
                    "x": this._$curArgs[2],
                    "y": this._$curArgs[3]
                });
                break;

            case SVGCommandTypes.QUAD_TO:
                this._$commands.push({
                    "type": SVGCommandTypes.QUAD_TO,
                    "relative": this._$curCommandRelative,
                    "x1": this._$curArgs[0],
                    "y1": this._$curArgs[1],
                    "x": this._$curArgs[2],
                    "y": this._$curArgs[3]
                });
                break;

            case SVGCommandTypes.ARC:
                this._$commands.push({
                    "type": SVGCommandTypes.ARC,
                    "relative": this._$curCommandRelative,
                    "rX": this._$curArgs[0],
                    "rY": this._$curArgs[1],
                    "xRot": this._$curArgs[2],
                    "lArcFlag": this._$curArgs[3],
                    "sweepFlag": this._$curArgs[4],
                    "x": this._$curArgs[5],
                    "y": this._$curArgs[6]
                });
                break;

            default:
                break;

        }

        this._$curArgs.length = 0;
        this._$canParseCommandOrComma = true;
    }

    /**
     * @param  {string} value
     * @return {boolean}
     * @method
     * @public
     */
    isDigit (value)
    {
        return "0".charCodeAt(0) <= value.charCodeAt(0)
            && value.charCodeAt(0) <= "9".charCodeAt(0);
    }

    /**
     * @param  {string} value
     * @return {boolean}
     * @method
     * @public
     */
    isWhiteSpace (value)
    {
        return " " === value
            || "\t" === value
            || "\r" === value
            || "\n" === value;
    }

    /**
     * @param  {function} transform
     * @return {SVGPathParser}
     * @method
     * @public
     */
    transform (transform)
    {
        this._$transforms.push(transform);
        return this;
    }
}