export function smoothScrollToBottom(element: HTMLDivElement | null, target: number | undefined, duration: number) {
    if (element !== null && target !== undefined) {
        const startTime = Date.now()
        const start = element.scrollTop
        const distance = target - start

        const animationStep = () => {
            const progress = Date.now() - startTime
            const percent = Math.min(progress / duration, 1)
            const easeInOutQuad = percent < 0.5 ? 2 * percent * percent : 1 - Math.pow(-2 * percent + 2, 2) / 2
            element.scrollTop = start + distance * easeInOutQuad

            if (progress < duration) {
                requestAnimationFrame(animationStep)
            }
        };

        requestAnimationFrame(animationStep)
    }
}