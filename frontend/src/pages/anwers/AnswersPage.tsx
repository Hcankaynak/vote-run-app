import * as React from 'react';
import "./anwersPage.scss"
import {Button} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {useNavigate, useParams} from "react-router-dom";
import {ANSWERS_COLLECTION_NAME, PRESENTATIONS_COLLECTION_NAME} from "../presentation/PresentationCreatorService";
import {addDoc, collection, doc, getDoc} from "firebase/firestore";
import {db} from "../../config/firebase-config";


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
    const [questions, setQuestions] = React.useState([{questionName: "", questionId: 0}]);
    const [answer, setAnswer] = React.useState("");
    const {presentationId} = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        console.log(presentationId);
        const docRef = doc(db, PRESENTATIONS_COLLECTION_NAME, presentationId);
        getDoc(docRef).then(r => {
            const ques = r.get("questions").reduce((accum, item) => {
                accum.push({questionName: item.topic, questionId: item.id});
                return accum;
            }, []);
            console.log(ques);
            setQuestions(ques);
        });
    }, [presentationId]);

    const addAnswer = () => {
        const questionId = questions[selectedQuestion].questionId + "";
        const answerRef = collection(db, ANSWERS_COLLECTION_NAME, presentationId, questionId);
        addDoc(answerRef, {
            text: answer,
            claps: 0
        }).then(r => console.log(r));
    }

    const seeAllAnswers = () => {
        console.log(presentationId);
        console.log(questions[selectedQuestion].questionId);
        navigate("/questionAnswers", {
            state: {
                presentationId: presentationId,
                questionId: questions[selectedQuestion].questionId + ""
            }
        })
    }

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
                    <Form.Control
                        as="textarea"
                        rows={3}
                        type="name"
                        placeholder="Enter Answer"
                        value={answer}
                        onChange={(value) => setAnswer(value.target.value)}
                    />
                </Form.Group>
            </div>
            <div className="answer-buttons">
                <div>
                    <Button className="see-all-button" type="button"
                            onClick={() => seeAllAnswers()}>See All Answers</Button>
                </div>
                <div>
                    <Button className="submit-button" type="button"
                            disabled={answer.length === 0}
                            onClick={() => {
                                setAnswer("");
                                addAnswer()
                            }}>Submit</Button>
                </div>
            </div>
        </div>
    )
}

export default AnswersPage;
