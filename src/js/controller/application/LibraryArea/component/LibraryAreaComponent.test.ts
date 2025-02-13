import { execute } from "./LibraryAreaComponent";
import { Shape } from "../../../../core/domain/model/Shape";
import { Folder } from "../../../../core/domain/model/Folder";
import { describe, expect, it } from "vitest";

describe("LibraryAreaComponent Test", () =>
{
    it("test case", () =>
    {
        const instance = new Shape({
            id: 1,
            name: "test shape",
            symbol: "test symbol",
            type: "shape"
        });
        const value = execute(instance);

        expect(value).toBe(`
<div class="library-list-box-child" id="library-child-id-1" data-library-id="1">
    <div class="library-list-box-spacer" data-library-id="1"></div>
    <div class="library-list-box-name" data-library-id="1">
        <i class="library-type-space" data-library-id="1"></i>
        <i class="library-type-shape" data-library-id="1"></i>
        <p><span class="view-text" data-library-id="1">test shape</span></p>
    </div>
    <div class="library-list-box-symbol" data-library-id="1">
        <p><span class="view-symbol-text" data-library-id="1">test symbol</span></p>
    </div>
</div>
`);
    });

    it("test case2", () =>
    {
        const instance = new Folder({
            id: 2,
            name: "test folder",
            type: "folder",
            mode: "close"
        });
        const value = execute(instance);
    
        expect(value).toBe(`
<div class="library-list-box-child" id="library-child-id-2" data-library-id="2">
    <div class="library-list-box-spacer" data-library-id="2"></div>
    <div class="library-list-box-name" data-library-id="2">
        <i class="library-type-arrow close" data-library-id="2"></i>
        <i class="library-type-folder-close" data-library-id="2"></i>
        <p><span class="view-text" data-library-id="2">test folder</span></p>
    </div>
    <div class="library-list-box-symbol" data-library-id="2">
        <p><span class="view-symbol-text" data-library-id="2"></span></p>
    </div>
</div>
`);
    });
});