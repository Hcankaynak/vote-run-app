import * as React from 'react';
import {Button} from "react-bootstrap";
import "./presentationCreator.scss"
import Form from "react-bootstrap/Form";

export interface IPresentationCreator {

}

interface IPresentationTopic {
    id: number;
    topic: string;
}

export const PresentationCreator = (props: IPresentationCreator) => {

    const [presentationTopics, setPresentationTopics] = React.useState<IPresentationTopic[]>([]);


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

    const renderPresentationTopics = () => {
        return presentationTopics.map((item) => {
            return (
                <div
                    key={item.id}
                    className="topic-element"
                >
                    <Form.Group className="topic input-element" controlId="formGroupName">
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
                    <Button variant="danger" onClick={event => deleteTopic(item.id)}>Delete</Button>
                </div>
            )
        })
    }
    return (
        <div className="presentation-creator">
            {renderPresentationTopics()}


            <Button variant="primary" onClick={event => addNewTopic()}>Add new topic</Button>
            <div className="btn-continue-shell">
                {
                    //TODO: continue navigate to next page.
                }
                <Button variant="success" onClick={event => console.log(presentationTopics)}>Continue</Button>
            </div>

        </div>
    );
}