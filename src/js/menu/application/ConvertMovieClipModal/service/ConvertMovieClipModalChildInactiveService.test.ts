import { execute } from "./ConvertMovieClipModalChildInactiveService";
import { $CONVERT_MOVIE_CLIP_MODAL_NAME } from "@/config/MenuConfig";
import { describe, expect, it, beforeEach, afterEach } from "vitest";

describe("ConvertMovieClipModalChildInactiveService", () =>
{
    let mockElement: HTMLElement;

    beforeEach(() =>
    {
        mockElement = document.createElement("div");
        mockElement.id = $CONVERT_MOVIE_CLIP_MODAL_NAME;
        document.body.appendChild(mockElement);
    });

    afterEach(() =>
    {
        document.body.innerHTML = "";
    });

    it("should remove active class from all child elements", () =>
    {
        const child1 = document.createElement("div");
        child1.className = "convert-movie-clip-box-child active";
        mockElement.appendChild(child1);

        const child2 = document.createElement("div");
        child2.className = "convert-movie-clip-box-child active";
        mockElement.appendChild(child2);

        const child3 = document.createElement("div");
        child3.className = "convert-movie-clip-box-child active";
        mockElement.appendChild(child3);

        execute();

        expect(child1.classList.contains("active")).toBe(false);
        expect(child2.classList.contains("active")).toBe(false);
        expect(child3.classList.contains("active")).toBe(false);
        expect(child1.className).toBe("convert-movie-clip-box-child");
        expect(child2.className).toBe("convert-movie-clip-box-child");
        expect(child3.className).toBe("convert-movie-clip-box-child");
    });

    it("should handle elements without active class", () =>
    {
        const child1 = document.createElement("div");
        child1.className = "convert-movie-clip-box-child";
        mockElement.appendChild(child1);

        const child2 = document.createElement("div");
        child2.className = "convert-movie-clip-box-child active";
        mockElement.appendChild(child2);

        execute();

        expect(child1.classList.contains("active")).toBe(false);
        expect(child2.classList.contains("active")).toBe(false);
    });

    it("should do nothing when modal element does not exist", () =>
    {
        document.body.innerHTML = "";
        
        expect(() => execute()).not.toThrow();
    });

    it("should do nothing when no child elements exist", () =>
    {
        expect(() => execute()).not.toThrow();
        
        const children = mockElement.querySelectorAll(".convert-movie-clip-box-child");
        expect(children.length).toBe(0);
    });

    it("should only affect elements with convert-movie-clip-box-child class", () =>
    {
        const child1 = document.createElement("div");
        child1.className = "convert-movie-clip-box-child active";
        mockElement.appendChild(child1);

        const child2 = document.createElement("div");
        child2.className = "other-class active";
        mockElement.appendChild(child2);

        execute();

        expect(child1.classList.contains("active")).toBe(false);
        expect(child2.classList.contains("active")).toBe(true);
    });

    it("should handle multiple classes on elements", () =>
    {
        const child = document.createElement("div");
        child.className = "convert-movie-clip-box-child active another-class";
        mockElement.appendChild(child);

        execute();

        expect(child.classList.contains("active")).toBe(false);
        expect(child.classList.contains("convert-movie-clip-box-child")).toBe(true);
        expect(child.classList.contains("another-class")).toBe(true);
    });
});
