import * as React from 'react';
import {Button} from "react-bootstrap";
import "./presentationCreator.scss"
import Form from "react-bootstrap/Form";
import {addDoc, collection, doc, getDoc, setDoc} from "firebase/firestore"
import {db} from "../../config/firebase-config";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {BiMoveVertical} from "react-icons/bi";
import {useNavigate} from "react-router-dom";
import {
    ANSWERS_COLLECTION_NAME,
    PRESENTATIONS_COLLECTION_NAME,
    USER_PRESENTATIONS_COLLECTION_NAME
} from "./PresentationCreatorService";

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
 * [ ] If adding successful navigate to qr page.
 * [ ] Design a beautiful list item.
 * [ ] If empty topic, don't create add validation.
 */

/**
 *
 * @param props
 * @constructor
 */
export const PresentationCreator = (props: IPresentationCreator) => {
    const [presentationTopics, setPresentationTopics] = React.useState<IPresentationTopic[]>([]);
    const navigate = useNavigate();

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
        const docRef = doc(db, USER_PRESENTATIONS_COLLECTION_NAME, props.userId);
        const docSnap = await getDoc(docRef);

        // user have presentation earlier.
        if (docSnap.exists()) {
            addPresentationToDB();
        } else {
            await setDoc(doc(db, USER_PRESENTATIONS_COLLECTION_NAME, props.userId), {}).then(r => console.log(r)).catch(err => console.log(err))
            addPresentationToDB();
        }
    }

    const addPresentationToDB = () => {
        const userPresentationsColRef = collection(db, USER_PRESENTATIONS_COLLECTION_NAME, props.userId, PRESENTATIONS_COLLECTION_NAME);
        const presentationsColRef = collection(db, PRESENTATIONS_COLLECTION_NAME);
        addDoc(presentationsColRef, {
            questions: presentationTopics,
            userId: props.userId
        }).then(presentation => {
            setDoc(doc(db, ANSWERS_COLLECTION_NAME, presentation.id), {}).then(r => console.log(r)).catch(reason => console.log(reason));
            addDoc(userPresentationsColRef, {
            }).then(userPresentation => {
                console.log(userPresentation);
                navigate("/qrcode", {
                    state: {
                        presentationId: presentation.id
                    }
                })
            }).catch(reason => console.log(reason))
        }).catch(reason => console.log(reason))
    }

    const checkValidation = () => {
        return presentationTopics.some((item) => item.topic === "") || presentationTopics.length == 0;
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
                <Button variant="success" disabled={checkValidation()} onClick={event => createPresentation()}>Create Presentation</Button>
            </div>

        </div>
    );
}
