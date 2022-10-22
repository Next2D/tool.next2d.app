describe("Util.js $getFrame test", () =>
{
    it("$getFrame test case1", () =>
    {
        const place = {
            "loop": Util.$getDefaultLoopConfig()
        };

        const range = {
            "startFrame": 1,
            "endFrame": 2
        };

        const parentFrame = 1;
        const totalFrame  = 10;
        const staticFrame = 0;

        const frame = Util.$getFrame(
            place,
            range,
            parentFrame,
            totalFrame,
            staticFrame
        );

        expect(frame).toBe(1);
    });
});
