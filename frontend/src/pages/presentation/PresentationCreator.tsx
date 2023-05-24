import * as React from 'react';
import {Button} from "react-bootstrap";
import "./presentationCreator.scss"
import Form from "react-bootstrap/Form";
import {addDoc, collection, doc, getDoc, setDoc} from "firebase/firestore"
import {db} from "../../config/firebase-config";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {BiMoveVertical} from "react-icons/bi";
import {COLLECTION_NAME} from "./PresentationCreatorService";
import {useNavigate} from "react-router-dom";

export interface IPresentationCreator {
    userId: string;
}

interface IPresentationTopic {
    id: number;
    topic: string;
}

/**
 * TODO
 *
 * [x] Delete button visible on hover.
 * [x] list items should be movable.
 * [ ] If adding successful navigate to qr page.
 * [ ] Design a beautiful list item.
 * [X] Add order number
 */


/**
 *
 * @param props
 * @constructor
 */
export const PresentationCreator = (props: IPresentationCreator) => {
    const [presentationTopics, setPresentationTopics] = React.useState<IPresentationTopic[]>([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        // const docsSnap = getDocs(colRef);
        // docsSnap.then((value) => {
        //     value.forEach(result => console.log(result.data()))
        // }).catch(err => console.log(err))
    }, [])

    const deleteTopic = (id: number) => {
        setPresentationTopics((prev) => {
            return prev.filter(item => item.id !== id);
        })
    }

    const addNewTopic = () => {
        setPresentationTopics((prev) => {
            // TODO:change epoch to uuid. or write your own unique id generator.
            return [...prev, {id: new Date().getTime(), topic: ""}];
        })
    }

    const createPresentation = async () => {
        const docRef = doc(db, COLLECTION_NAME, props.userId);

        // await setDoc(doc(db, ""))
        const docSnap = await getDoc(docRef);
        // db.collection(COLLECTION_NAME).doc(props.userId)
        // addDoc(colRef, {
        //     list: presentationTopics,
        //     user: props.userId
        // }).then(r => console.log(r)).catch(err => console.log(err))
        if (docSnap.exists()) {
            const colRef = collection(db, COLLECTION_NAME, props.userId, COLLECTION_NAME);


            addDoc(colRef, {
                list: presentationTopics,
                user: props.userId
            }).then(value => {
                navigate("/qrcode", {state: "blalasd"})
            })
            console.log("docSnap")

            console.log(docSnap)
        } else {

            await setDoc(doc(db, COLLECTION_NAME, props.userId),{

            }).then(r => console.log(r)).catch(err => console.log(err))

            const colRef = collection(db, COLLECTION_NAME, props.userId, COLLECTION_NAME);

            await addDoc(colRef, {
                list: presentationTopics,
                user: props.userId
            })

        }
    }

    const handleOnDragEnd = (context) => {
        if (!context.destination) return;

        const items = Array.from(presentationTopics);
        const [reorderedItem] = items.splice(context.source.index, 1);
        items.splice(context.destination.index, 0, reorderedItem);

        setPresentationTopics(items);
    }

    const renderPresentationTopics = () => {
        return <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="presentationTopics">
                {
                    (provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {presentationTopics.map((item, index) => {
                                return (
                                    <Draggable key={item.id} draggableId={item.id + ""} index={index}>
                                        {(provided) => (
                                            <div
                                                key={item.id}
                                                className="topic-element"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <BiMoveVertical size={20}/>
                                                <div>{index + 1}</div>
                                                <Form.Group className="topic input-element" controlId="formGroupName">
                                                    <Form.Label>Topic</Form.Label>
                                                    <Form.Control
                                                        required
                                                        type="topic"
                                                        placeholder="Enter Topic"
                                                        onChange={(value) => setPresentationTopics((prevState => {
                                                            const elementIndex = prevState.findIndex((el => el.id === item.id))
                                                            const updatedList = [...prevState];
                                                            updatedList[elementIndex].topic = value.target.value;
                                                            return updatedList;
                                                        }))}
                                                    />
                                                </Form.Group>
                                                <div className="delete-item-button">
                                                    <Button variant="danger"
                                                            onClick={event => deleteTopic(item.id)}>Delete</Button>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                )
                            })}
                            {provided.placeholder}
                        </div>
                    )
                }
            </Droppable>
        </DragDropContext>
    }
    return (
        <div className="presentation-creator">
            {renderPresentationTopics()}


            <Button variant="primary" onClick={event => addNewTopic()}>Add new topic</Button>
            <div className="btn-continue-shell">
                <Button variant="success" onClick={event => createPresentation()}>Create Presentation</Button>
            </div>

        </div>
    );
}
