describe("InstanceType.js property test", () =>
{
    it("SHAPE test", () =>
    {
        expect(InstanceType.SHAPE).toBe("shape");
    });

    it("BITMAP test", () =>
    {
        expect(InstanceType.BITMAP).toBe("bitmap");
    });

    it("VIDEO test", () =>
    {
        expect(InstanceType.VIDEO).toBe("video");
    });

    it("FOLDER test", () =>
    {
        expect(InstanceType.FOLDER).toBe("folder");
    });

    it("SOUND test", () =>
    {
        expect(InstanceType.SOUND).toBe("sound");
    });

    it("MOVIE_CLIP test", () =>
    {
        expect(InstanceType.MOVIE_CLIP).toBe("container");
    });

    it("TEXT test", () =>
    {
        expect(InstanceType.TEXT).toBe("text");
    });
});
