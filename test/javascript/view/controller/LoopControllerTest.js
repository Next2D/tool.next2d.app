describe("LoopController.js property test", () =>
{
    it("DEFAULT test", () =>
    {
        expect(LoopController.REPEAT).toBe(0);
    });

    it("NO_REPEAT test", () =>
    {
        expect(LoopController.NO_REPEAT).toBe(1);
    });

    it("FIXED_ONE test", () =>
    {
        expect(LoopController.FIXED_ONE).toBe(2);
    });

    it("NO_REPEAT_REVERSAL test", () =>
    {
        expect(LoopController.NO_REPEAT_REVERSAL).toBe(3);
    });

    it("REPEAT_REVERSAL test", () =>
    {
        expect(LoopController.REPEAT_REVERSAL).toBe(4);
    });

    it("DEFAULT test", () =>
    {
        expect(LoopController.DEFAULT).toBe(5);
    });
});
