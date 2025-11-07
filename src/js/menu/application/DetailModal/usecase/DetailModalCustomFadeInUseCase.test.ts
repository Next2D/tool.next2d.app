import { execute } from "./DetailModalCustomFadeInUseCase";
import { $DETAIL_MODAL_NAME } from "@/config/MenuConfig";
import { $replace } from "@/language/application/LanguageUtil";
import { $getMenu } from "../../MenuUtil";
import { execute as detailModalHideService } from "../service/DetailModalHideService";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/language/application/LanguageUtil");
vi.mock("../../MenuUtil");
vi.mock("../service/DetailModalHideService");

describe("DetailModalCustomFadeInUseCase", () =>
{
    let mockElement: HTMLElement;
    let mockMenu: any;

    beforeEach(() =>
    {
        vi.useFakeTimers();

        mockElement = document.createElement("div");
        mockElement.id = $DETAIL_MODAL_NAME;
        mockElement.textContent = "";
        Object.defineProperty(mockElement, "clientWidth", { value: 100, writable: true });
        Object.defineProperty(mockElement, "clientHeight", { value: 50, writable: true });
        document.body.appendChild(mockElement);

        mockMenu = {
            offsetLeft: 0,
            offsetTop: 0,
            show: vi.fn(),
            hide: vi.fn()
        };

        vi.mocked($getMenu).mockReturnValue(mockMenu);
        vi.mocked($replace).mockImplementation((text: string) => text);
        vi.mocked(detailModalHideService).mockReturnValue(undefined);

        Object.defineProperty(window, "innerWidth", { value: 1920, writable: true });
        Object.defineProperty(window, "innerHeight", { value: 1080, writable: true });
    });

    afterEach(() =>
    {
        document.body.innerHTML = "";
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    it("should display modal at correct position", () =>
    {
        execute("test.message", 100, 200);

        expect($getMenu).toHaveBeenCalledWith($DETAIL_MODAL_NAME);
        expect($replace).toHaveBeenCalledWith("{{test.message}}");
        expect(mockElement.textContent).toBe("test.message");
        expect(mockMenu.offsetLeft).toBe(80);
        expect(mockMenu.offsetTop).toBe(220);
        expect(detailModalHideService).toHaveBeenCalled();
        expect(mockMenu.show).toHaveBeenCalled();
    });

    it("should return early if element does not exist", () =>
    {
        document.body.innerHTML = "";

        execute("test.message", 100, 200);

        expect($getMenu).not.toHaveBeenCalled();
        expect(mockMenu.show).not.toHaveBeenCalled();
    });

    it("should return early if element has fadeIn class", () =>
    {
        mockElement.classList.add("fadeIn");

        execute("test.message", 100, 200);

        expect($getMenu).not.toHaveBeenCalled();
        expect(mockMenu.show).not.toHaveBeenCalled();
    });

    it("should return early if menu is not found", () =>
    {
        vi.mocked($getMenu).mockReturnValue(null);

        execute("test.message", 100, 200);

        expect($getMenu).toHaveBeenCalled();
        expect(mockMenu.show).not.toHaveBeenCalled();
    });

    it("should adjust x position when exceeds right edge", () =>
    {
        Object.defineProperty(window, "innerWidth", { value: 200, writable: true });

        execute("test.message", 150, 200);

        expect(mockMenu.offsetLeft).toBeLessThan(150);
        expect(mockMenu.show).toHaveBeenCalled();
    });

    it("should adjust x position when exceeds left edge", () =>
    {
        execute("test.message", 5, 200);

        expect(mockMenu.offsetLeft).toBe(10);
        expect(mockMenu.show).toHaveBeenCalled();
    });

    it("should adjust y position when exceeds bottom edge", () =>
    {
        Object.defineProperty(window, "innerHeight", { value: 100, writable: true });

        execute("test.message", 100, 90);

        expect(mockMenu.offsetTop).toBeLessThan(90);
        expect(mockMenu.show).toHaveBeenCalled();
    });

    it("should set timer to auto-hide modal after 1.5 seconds", () =>
    {
        execute("test.message", 100, 200);

        expect(mockElement.dataset.timerId).toBeDefined();
        expect(detailModalHideService).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(1500);

        expect(detailModalHideService).toHaveBeenCalledTimes(2);
    });

    it("should remove curly braces from text", () =>
    {
        vi.mocked($replace).mockReturnValue("{{test.message}}");

        execute("test.message", 100, 200);

        expect(mockElement.textContent).toBe("test.message");
    });
});
