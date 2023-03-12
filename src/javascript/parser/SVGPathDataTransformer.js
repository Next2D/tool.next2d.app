/**
 * @class
 */
class SVGPathDataTransformer
{
    /**
     * @param  {function} f
     * @return {function}
     * @method
     * @static
     */
    static INFO (f)
    {
        let prevXAbs = 0;
        let prevYAbs = 0;
        let pathStartXAbs = NaN;
        let pathStartYAbs = NaN;

        return function transform (command)
        {
            if (isNaN(pathStartXAbs)
                && !(command.type & SVGCommandTypes.MOVE_TO)
            ) {
                throw new Error("path must start with moveto");
            }

            const result = f(
                command,
                prevXAbs,
                prevYAbs,
                pathStartXAbs,
                pathStartYAbs
            );

            if (command.type & SVGCommandTypes.CLOSE_PATH) {
                prevXAbs = pathStartXAbs;
                prevYAbs = pathStartYAbs;
            }

            if ("undefined" !== typeof command.x) {
                prevXAbs = command.relative ? prevXAbs + command.x : command.x;
            }

            if ("undefined" !== typeof command.y) {
                prevYAbs = command.relative ? prevYAbs + command.y : command.y;
            }

            if (command.type & SVGCommandTypes.MOVE_TO) {
                pathStartXAbs = prevXAbs;
                pathStartYAbs = prevYAbs;
            }

            return result;
        };
    }

    /**
     * @param  {number} a
     * @param  {number} b
     * @param  {number} c
     * @param  {number} d
     * @param  {number} e
     * @param  {number} f
     * @return {function}
     * @method
     * @static
     */
    static MATRIX (a, b, c, d, e, f)
    {
        return SVGPathDataTransformer.INFO((command, prevX, prevY, pathStartX) =>
        {
            const origX1 = command.x1;
            const origX2 = command.x2;

            // if isNaN(pathStartX), then this is the first command, which is ALWAYS an
            // absolute MOVE_TO, regardless what the relative flag says
            const comRel = command.relative && !isNaN(pathStartX);
            const x = "undefined" !== typeof command.x ? command.x : comRel ? 0 : prevX;
            const y = "undefined" !== typeof command.y ? command.y : comRel ? 0 : prevY;

            if (command.type & SVGCommandTypes.HORIZ_LINE_TO && 0 !== b) {
                command.type = SVGCommandTypes.LINE_TO;
                command.y = command.relative ? 0 : prevY;
            }

            if (command.type & SVGCommandTypes.VERT_LINE_TO && 0 !== c) {
                command.type = SVGCommandTypes.LINE_TO;
                command.x = command.relative ? 0 : prevX;
            }

            if ("undefined" !== typeof command.x) {
                command.x = command.x * a + y * c + (comRel ? 0 : e);
            }

            if ("undefined" !== typeof command.y) {
                command.y = x * b + command.y * d + (comRel ? 0 : f);
            }

            if ("undefined" !== typeof command.x1) {
                command.x1 = command.x1 * a + command.y1 * c + (comRel ? 0 : e);
            }

            if ("undefined" !== typeof command.y1) {
                command.y1 = origX1 * b + command.y1 * d + (comRel ? 0 : f);
            }

            if ("undefined" !== typeof command.x2) {
                command.x2 = command.x2 * a + command.y2 * c + (comRel ? 0 : e);
            }

            if ("undefined" !== typeof command.y2) {
                command.y2 = origX2 * b + command.y2 * d + (comRel ? 0 : f);
            }

            function sqr (x)
            {
                return x * x;
            }

            const det = a * d - b * c;

            if ("undefined" !== typeof command.xRot) {

                // Skip if this is a pure translation
                if (1 !== a || 0 !== b || 0 !== c || 1 !== d) {
                    // Special case for singular matrix
                    if (0 === det) {

                        // In the singular case, the arc is compressed to a line. The actual geometric image of the original
                        // curve under this transform possibly extends beyond the starting and/or ending points of the segment, but
                        // for simplicity we ignore this detail and just replace this command with a single line segment.
                        delete command.rX;
                        delete command.rY;
                        delete command.xRot;
                        delete command.lArcFlag;
                        delete command.sweepFlag;
                        command.type = SVGCommandTypes.LINE_TO;

                    } else {

                        // Convert to radians
                        const xRot = command.xRot * Math.PI / 180;

                        // Convert rotated ellipse to general conic form
                        // x0^2/rX^2 + y0^2/rY^2 - 1 = 0
                        // x0 = x*cos(xRot) + y*sin(xRot)
                        // y0 = -x*sin(xRot) + y*cos(xRot)
                        // --> A*x^2 + B*x*y + C*y^2 - 1 = 0, where
                        const sinRot = Math.sin(xRot);
                        const cosRot = Math.cos(xRot);
                        const xCurve = 1 / sqr(command.rX);
                        const yCurve = 1 / sqr(command.rY);
                        const A = sqr(cosRot) * xCurve + sqr(sinRot) * yCurve;
                        const B = 2 * sinRot * cosRot * (xCurve - yCurve);
                        const C = sqr(sinRot) * xCurve + sqr(cosRot) * yCurve;

                        // Apply matrix to A*x^2 + B*x*y + C*y^2 - 1 = 0
                        // x1 = a*x + c*y
                        // y1 = b*x + d*y
                        //      (we can ignore e and f, since pure translations don"t affect the shape of the ellipse)
                        // --> A1*x1^2 + B1*x1*y1 + C1*y1^2 - det^2 = 0, where
                        const A1 = A * d * d - B * b * d + C * b * b;
                        const B1 = B * (a * d + b * c) - 2 * (A * c * d + C * a * b);
                        const C1 = A * c * c - B * a * c + C * a * a;

                        // Unapply newXRot to get back to axis-aligned ellipse equation
                        // x1 = x2*cos(newXRot) - y2*sin(newXRot)
                        // y1 = x2*sin(newXRot) + y2*cos(newXRot)
                        // A1*x1^2 + B1*x1*y1 + C1*y1^2 - det^2 =
                        //   x2^2*(A1*cos(newXRot)^2 + B1*sin(newXRot)*cos(newXRot) + C1*sin(newXRot)^2)
                        //   + x2*y2*(2*(C1 - A1)*sin(newXRot)*cos(newXRot) + B1*(cos(newXRot)^2 - sin(newXRot)^2))
                        //   + y2^2*(A1*sin(newXRot)^2 - B1*sin(newXRot)*cos(newXRot) + C1*cos(newXRot)^2)
                        //   (which must have the same zeroes as)
                        // x2^2/newRX^2 + y2^2/newRY^2 - 1
                        //   (so we have)
                        // 2*(C1 - A1)*sin(newXRot)*cos(newXRot) + B1*(cos(newXRot)^2 - sin(newXRot)^2) = 0
                        // (A1 - C1)*sin(2*newXRot) = B1*cos(2*newXRot)
                        // 2*newXRot = atan2(B1, A1 - C1)
                        const newXRot = (Math.atan2(B1, A1 - C1) + Math.PI) % Math.PI / 2;
                        // For any integer n, (atan2(B1, A1 - C1) + n*pi)/2 is a solution to the above; incrementing n just swaps
                        // the x and y radii computed below (since that"s what rotating an ellipse by pi/2 does).  Choosing the
                        // rotation between 0 and pi/2 eliminates the ambiguity and leads to more predictable output.

                        // Finally, we get newRX and newRY from the same-zeroes relationship that gave us newXRot
                        const newSinRot = Math.sin(newXRot);
                        const newCosRot = Math.cos(newXRot);

                        command.rX = Math.abs(det) /
                            Math.sqrt(A1 * sqr(newCosRot) + B1
                                * newSinRot * newCosRot + C1 * sqr(newSinRot));

                        command.rY = Math.abs(det) /
                            Math.sqrt(A1 * sqr(newSinRot) - B1
                                * newSinRot * newCosRot + C1 * sqr(newCosRot));

                        command.xRot = newXRot * 180 / Math.PI;
                    }
                }
            }

            // sweepFlag needs to be inverted when mirroring shapes
            // see http://www.itk.ilstu.edu/faculty/javila/SVG/SVG_drawing1/elliptical_curve.htm
            // m 65,10 a 50,25 0 1 0 50,25
            // M 65,60 A 50,25 0 1 1 115,35
            if ("undefined" !== typeof command.sweepFlag && 0 > det) {
                command.sweepFlag = +!command.sweepFlag;
            }

            return command;
        });
    }

    /**
     * @param  {number} x
     * @param  {number} [y=0]
     * @return {function}
     * @const
     * @method
     * @static
     */
    static TRANSLATE (x, y = 0)
    {
        return SVGPathDataTransformer.MATRIX(1, 0, 0, 1, x, y);
    }

    /**
     * @param  {number} x
     * @param  {number|null} [y=null]
     * @return {function}
     * @const
     * @method
     * @static
     */
    static SCALE (x, y) {
        return SVGPathDataTransformer.MATRIX(x, 0, 0, y, 0, 0);
    }

    /**
     * @param  {number} a
     * @param  {number} [x=0]
     * @param  {number} [y=0]
     * @param  {number|null} [y=null]
     * @return {function}
     * @const
     * @method
     * @static
     */
    static ROTATE (a, x = 0, y = 0)
    {
        const sin = Math.sin(a);
        const cos = Math.cos(a);
        return SVGPathDataTransformer.MATRIX(
            cos, sin, -sin, cos, x - x * cos + y * sin, y - x * sin - y * cos
        );
    }

    /**
     * @param  {number} a
     * @return {function}
     * @const
     * @method
     * @static
     */
    static SKEW_X (a)
    {
        return SVGPathDataTransformer.MATRIX(1, 0, Math.atan(a), 1, 0, 0);
    }

    /**
     * @param  {number} a
     * @return {function}
     * @const
     * @method
     * @static
     */
    static SKEW_Y (a)
    {
        return SVGPathDataTransformer.MATRIX(1, Math.atan(a), 0, 1, 0, 0);
    }
}