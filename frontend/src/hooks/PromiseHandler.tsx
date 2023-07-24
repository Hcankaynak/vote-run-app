import React from "react";


// TODO:return type interface?
enum PromiseState {
    EMPTY,
    BUSY
}

const usePromiseHandler = () => {
    const [promiseList, setPromiseList] = React.useState([]);
    const [currentState, setCurrentState] = React.useState(PromiseState.EMPTY);

    /**
     * 1- on addition check status and start processing.
     * 2- if current promise resolved then move to next one.
     */

    React.useEffect(() => {
        checkListAndStartProcess();
    }, [promiseList]);

    React.useEffect(() => {
        checkListAndStartProcess();
    }, [currentState]);

    const checkListAndStartProcess = (): void => {
        if (promiseList.length > 0 && currentState === PromiseState.EMPTY) {
            const promise = promiseList[0];
            setCurrentState(PromiseState.BUSY);
            setPromiseList(promiseList.shift());
            resolveCurrentPromise(promise);
        }
    }

    const resolveCurrentPromise = (promise: Promise<any>) => {
        promise.then(value => {
            console.log("Promise successfully handled.");
            checkListAndStartProcess();
            setCurrentState(PromiseState.EMPTY);
        }).catch(reason => {
            console.log("Error occurred.");
            checkListAndStartProcess();
            setCurrentState(PromiseState.EMPTY);
        })
    }

    const addNewPromise = (promise: Promise<any>) => {
        const tempList = promiseList;
        tempList.push(promise);
        setPromiseList(tempList);
    }

    return [addNewPromise];
}

export default usePromiseHandler;
