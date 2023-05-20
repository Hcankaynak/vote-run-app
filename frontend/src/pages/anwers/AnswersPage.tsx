import * as React from 'react';
import "./anwersPage.scss"
import {Button} from "react-bootstrap";
import Form from "react-bootstrap/Form";


const questions = [{
    questionName: "Question1"
},
    {
        questionName: "Question2"
    },
    {
        questionName: "Question3"
    },
    {
        questionName: "Question4"
    },
    {
        questionName: "Question5"
    }]

const AnswersPage = () => {
    const [selectedQuestion, setSelectedQuestion] = React.useState(0);
    const [render, reRender] = React.useState(false);
    const [answer, setAnswer] = React.useState("");

    return (
        <div className="answers-page">
            <div className="answers-page-header">
                <div className="prev">
                    <Button className="prev-button" type="button"
                            disabled={selectedQuestion === 0}
                            onClick={() => {
                                if (selectedQuestion > 0) {
                                    setSelectedQuestion(selectedQuestion - 1);
                                }
                            }}>Prev</Button>
                </div>
                <div className="questions">
                    {selectedQuestion + 1 + "/" + questions.length}
                </div>
                <div className="next">
                    <Button className="next-button" type="button"
                            disabled={selectedQuestion === questions.length - 1}
                            onClick={() => {
                                if (selectedQuestion < questions.length - 1) {
                                    setSelectedQuestion(selectedQuestion + 1);
                                }
                            }}>Next</Button>
                </div>
            </div>
            <hr/>
            <div className="question-header">
                <div>
                    {questions[selectedQuestion].questionName}
                </div>
            </div>
            <div className="answer-section">
                <Form.Group className="answer input-element" controlId="formGroupName">
                    <Form.Label>Answer</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        type="name"
                        placeholder="Enter Answer"
                        defaultValue={""}
                        value={answer}
                        onChange={(value) => setAnswer(value.target.value)}
                    />
                </Form.Group>
            </div>
            <div className="answer-buttons">
                <div>
                    <Button className="see-all-button" type="button"
                            onClick={() => {
                            }}>See All Answers</Button>
                </div>
                <div>
                    <Button className="submit-button" type="button"
                            disabled={answer.length === 0}
                            onClick={() => {
                                console.log(answer);
                                setAnswer("");
                            }}>Submit</Button>
                </div>
            </div>
        </div>
    )
}

export default AnswersPage;
