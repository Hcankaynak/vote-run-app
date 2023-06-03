export const getItemFromLocalStorage = (): {} => {
    return JSON.parse(localStorage.getItem(window.location.origin));
}

export const setItemToLocalStorage = (data: {}): void => {
    localStorage.setItem(window.location.origin, JSON.stringify(data));
}
