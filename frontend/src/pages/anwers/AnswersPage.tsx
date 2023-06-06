import * as React from 'react';
import "./anwersPage.scss"
import {Alert, Button} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {ANSWERS_COLLECTION_NAME, PRESENTATIONS_COLLECTION_NAME} from "../presentation/PresentationCreatorService";
import {addDoc, collection, doc, getDoc} from "firebase/firestore";
import {db} from "../../config/firebase-config";
import {MdNavigateBefore, MdNavigateNext} from "react-icons/md";


const AnswersPage = () => {
    const {state} = useLocation();
    const [selectedQuestion, setSelectedQuestion] = React.useState(0);
    const [questions, setQuestions] = React.useState([{questionName: "", questionId: 0}]);
    const [answer, setAnswer] = React.useState("");
    const nextRef = React.useRef();
    const [show, setShow] = React.useState({
        isShown: false,
        type: "success"
    });
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
            console.log("asdasd", state?.questionNumber);
            // setSelectedQuestion(state?.questionNumber - 1);
        });
    }, [presentationId]);

    const addAnswer = () => {
        const questionId = questions[selectedQuestion].questionId + "";
        const answerRef = collection(db, ANSWERS_COLLECTION_NAME, presentationId, questionId);
        addDoc(answerRef, {
            text: answer,
            like: 0,
            timeStamp: Date.now()
        }).then(r => {
            setShow({isShown: true, type: "success"});
            setTimeout(() => {
                setShow({...show, isShown: false});
            }, 1000)
        }).catch(reason => {
            setShow({isShown: true, type: "danger"});
            setTimeout(() => {
                setShow({...show, isShown: false});
            }, 1000)
        });
    }

    const seeAllAnswers = () => {
        console.log(presentationId);
        console.log(questions[selectedQuestion].questionId);
        navigate("/questionAnswers", {
            state: {
                presentationId: presentationId,
                questionId: questions[selectedQuestion].questionId + "",
                question: questions[selectedQuestion].questionName,
                questionNumber: selectedQuestion
            }
        })
    }

    return (
        <div className="answers-page">
            <div className="answers-page-header">
                <div className="answers-page-header-content">
                    <div className="prev">
                        <Button className="prev-button" type="button"
                                disabled={selectedQuestion === 0}
                                onClick={() => {
                                    if (selectedQuestion > 0) {
                                        setSelectedQuestion(selectedQuestion - 1);
                                    }
                                }}><MdNavigateBefore size={23} style={{color: 'white'}}/>Prev</Button>
                    </div>
                    <div className="questions">
                        <div>
                            {selectedQuestion + 1 + "/" + questions.length}
                        </div>
                    </div>
                    <div className="next">
                        <Button className="next-button" type="button"
                                disabled={selectedQuestion === questions.length - 1}
                                onClick={() => {
                                    if (selectedQuestion < questions.length - 1) {
                                        setSelectedQuestion(selectedQuestion + 1);
                                    }
                                }}>
                            <span ref={nextRef}>
                                Next
                            </span>
                            <MdNavigateNext size={23} style={{color: 'white'}}/></Button>
                    </div>
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
                            variant="light"
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
            {show.isShown &&
                <div className="answer-alert">
                    <Alert key={show.type} variant={show.type} onClose={() => setShow({...show, isShown: false})}>
                        <Alert.Heading>Success</Alert.Heading>
                        <p>
                            Successfully submitted.
                        </p>
                    </Alert>
                </div>}
        </div>
    )
}

export default AnswersPage;
