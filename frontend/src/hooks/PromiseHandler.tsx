import React from "react";


// TODO:return type interface?
const usePromiseHandler = () => {
    const [promiseList, setPromiseList] = React.useState([]);

    React.useEffect(() => {
        // resolve promise
    }, [promiseList]);

    const addNewPromise = (promise: Promise<any>) => {
        setPromiseList([...promiseList, promise]);
    }

    return [addNewPromise]
}

export default usePromiseHandler;
