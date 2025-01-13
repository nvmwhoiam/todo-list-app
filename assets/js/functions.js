export function setClosedToOpen(selector) {

    selector.setAttribute("data-state", "open");

    selector.setAttribute("aria-expanded", true);
}

export function setClosingToClosed(selector) {
    selector.setAttribute("data-state", "closing");

    selector.setAttribute("aria-expanded", false);

    selector.addEventListener("animationend", function () {

        selector.setAttribute("data-state", "closed");

    }, { once: true });
}

export function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

export function dropdownMenu(selector) {

    if (selector.getAttribute("data-state") !== "open") {
        setClosedToOpen(selector)

    } else {
        setClosingToClosed(selector)
    }
}
