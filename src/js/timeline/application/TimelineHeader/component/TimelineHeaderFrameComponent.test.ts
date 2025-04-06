import { execute } from "./TimelineHeaderFrameComponent";
import { describe, expect, it } from "vitest";

describe("TimelineHeaderFrameComponent", () =>
{
    it("execute test case2", (): void =>
        {
            expect(execute(3)).toBe(`
<div class="frame-header-parent" data-frame="3">
    <div class="frame-sec frame-border"></div>
    <div class="frame-border-box"></div>
    <div class="frame-border-box"></div>
    <div class="frame-border-box"></div>
    <div class="frame-number"></div>
</div>
`);
    });

    it("execute test case2", (): void =>
    {
        expect(execute(10)).toBe(`
<div class="frame-header-parent" data-frame="10">
    <div class="frame-sec frame-border-end"></div>
    <div class="frame-border-box"></div>
    <div class="frame-border-box"></div>
    <div class="frame-border-box"></div>
    <div class="frame-number">10</div>
</div>
`);
    });
});