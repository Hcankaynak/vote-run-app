import * as React from 'react';
import "./questionsPage.scss";
import {GrReturn} from "react-icons/gr";
import {Button, Card} from "react-bootstrap";
import {useLocation, useNavigate} from "react-router-dom";
import {collection, doc, getDoc, getDocs} from "firebase/firestore";
import {db} from "../../config/firebase-config";
import {ANSWERS_COLLECTION_NAME, PRESENTATIONS_COLLECTION_NAME} from "../presentation/PresentationCreatorService";


const QuestionAnswersPage = () => {
    const [topicAllAnswer, setTopicAllAnswer] = React.useState([]);
    const {state} = useLocation();
    const {presentationId, questionId, question} = state;
    const navigate = useNavigate();

    React.useEffect(() => {
        console.log(questionId)

        console.log(presentationId)

    }, [questionId, presentationId])

    React.useEffect(() => {
        console.log(presentationId);
        // const answersRef = doc(db, ANSWERS_COLLECTION_NAME, presentationId, questionId);
        const answersRef =collection(db, ANSWERS_COLLECTION_NAME, presentationId, questionId);

        getDocs(answersRef).then(r => {

            const ans = r.docs.reduce((accum, item) => {
                accum.push({text: item.get("text"), clap: item.get("claps")});
                return accum;
            }, []);
            console.log(r.docs);
            setTopicAllAnswer(ans);
        });
    }, [presentationId]);

    return (
        <div className="questions-page">
            <div className="questions-page-header">
                <div className="return-button">
                    <Button onClick={() => navigate(-1)}>
                        <GrReturn size={23}/>
                    </Button>
                </div>
                <div className="question-header">
                    {question}
                </div>
            </div>
            <hr/>
            <div className="questions-page-content">
                {
                    topicAllAnswer.map((item) => {
                        return (
                            <Card className="answer-card">
                                <Card.Body>{item?.text}</Card.Body>
                            </Card>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default QuestionAnswersPage;
