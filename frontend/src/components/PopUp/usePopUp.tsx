import React from "react";

export const usePopUp = (): [boolean, () => void, () => void] => {
    const [isVisible, setIsVisible] = React.useState(false);

    const openPopUp = (): void => {
        setIsVisible(true);
    }
    const setReverseVisible = (): void => {
        setIsVisible(prevState => !prevState);
    }

    return [isVisible, setReverseVisible, openPopUp];
}