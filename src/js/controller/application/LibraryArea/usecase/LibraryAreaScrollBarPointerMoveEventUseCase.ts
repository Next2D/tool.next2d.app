export const execute = (event: PointerEvent): void =>
{
    // イベントの伝達を止める
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame(() =>
    {
        const element: HTMLElement | null = event.target as HTMLElement;
        if (!element) {
            return ;
        }

        // todo
    });
};