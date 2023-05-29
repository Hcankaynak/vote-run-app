import * as React from 'react';
import "./questionsPage.scss";
import {GrReturn} from "react-icons/gr";
import {Button, Card} from "react-bootstrap";
import {useLocation, useNavigate} from "react-router-dom";
import {collection, getDocs, onSnapshot} from "firebase/firestore";
import {db} from "../../config/firebase-config";
import {ANSWERS_COLLECTION_NAME} from "../presentation/PresentationCreatorService";


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
        const unsub = onSnapshot(collection(db, ANSWERS_COLLECTION_NAME, presentationId, questionId), (doc) => {
            console.log("Current data: ", doc.docs);
            convertDBObjectToReactObject(doc.docs);
        });
        return () => unsub();
    }, []);

    React.useEffect(() => {
        console.log(presentationId);
        const answersRef = collection(db, ANSWERS_COLLECTION_NAME, presentationId, questionId);

        getDocs(answersRef).then((r) => {
            // convertDBObjectToReactObject(r);
            console.log(r);
        });
    }, [presentationId]);

    const convertDBObjectToReactObject = (docs) => {
        console.log(docs.data);
        const ans = docs.reduce((accum, item) => {
            accum.push({text: item.get("text"), clap: item.get("claps")});
            return accum;
        }, []);
        console.log(docs);
        setTopicAllAnswer(ans);
    }

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
