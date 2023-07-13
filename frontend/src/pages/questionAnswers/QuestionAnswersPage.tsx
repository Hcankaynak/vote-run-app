import * as React from 'react';
import "./questionsAnswersPage.scss";
import {Button, Card} from "react-bootstrap";
import {useLocation, useNavigate} from "react-router-dom";
import {collection, doc, onSnapshot, orderBy, query, runTransaction} from "firebase/firestore";
import {db} from "../../config/firebase-config";
import {ANSWERS_COLLECTION_NAME} from "../presentation/PresentationCreatorService";
import {FaHeart} from "react-icons/fa";
import {getItemFromLocalStorage} from "../../Utils/LocalStorage";
import {MdNavigateBefore} from "react-icons/md";

interface IAnswer {
    text: string;
    like: number;
    id: string;
}

const QuestionAnswersPage = () => {
    const [topicAllAnswer, setTopicAllAnswer] = React.useState<IAnswer[]>([]);
    const [userLikeStorage, setUserLikeStorage] = React.useState({});
    const [isLoading, setLoading] = React.useState(true);
    const {state} = useLocation();
    const navigate = useNavigate();
    const hostName = window.location.origin;
    const {presentationId, questions, selectedQuestion} = state;


    React.useEffect(() => {
        setUserLikeStorage(getItemFromLocalStorage());
    }, [topicAllAnswer])


    React.useEffect(() => {
        const answersRef = collection(db, ANSWERS_COLLECTION_NAME, presentationId, questions[selectedQuestion]?.questionId + "")
        const q = query(answersRef, orderBy("timeStamp"));
        const unsub = onSnapshot(q, (doc) => {
            convertDBObjectToReactObject(doc.docs);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const convertDBObjectToReactObject = (docs) => {
        const ans = docs.reduce((accum, item) => {
            accum.push({text: item.get("text"), like: item.get("like"), id: item.id});
            return accum;
        }, []);
        setTopicAllAnswer(ans);
    }

    const decideIncreaseOrDecrease = (answerId, likeCount: number): number => {
        // userLikeStorage?.answerId
        // if local storage has it, decrease; if number is zero return zero;, otherwise increase
        return likeCount + 1;
    }

    const likeAnswer = async (answerId: string) => {
        try {
            const sfDocRef = doc(db, ANSWERS_COLLECTION_NAME, presentationId, questions[selectedQuestion]?.questionId, answerId);

            const answerTransaction = await runTransaction(db, async (transaction) => {
                const sfDoc = await transaction.get(sfDocRef);
                if (!sfDoc.exists()) {
                    throw "Document does not exist!";
                }
                const newPopulation = decideIncreaseOrDecrease(answerId, sfDoc.data().like);
                transaction.update(sfDocRef, {like: newPopulation});
            });
            const newUserLikeItem = {}
            newUserLikeItem[questions[selectedQuestion].questionId] = {}
            newUserLikeItem[questions[selectedQuestion].questionId][sfDocRef.id] = 1;
            localStorage.setItem(presentationId, JSON.stringify(newUserLikeItem));
            console.log("Transaction successfully committed!");
        } catch (e) {
            console.log("Transaction failed: ", e);
        }
        console.log(answerId);
    }

    const generatePath = (presentationId) => {
        return "/answers" + "/" + presentationId;
    };

    return (
        <div className="questions-page">
            <div className="questions-page-header">
                <div className="return-button">
                    <Button onClick={() => navigate(generatePath(presentationId), {
                        state: {
                            questions,
                            selectedQuestion
                        }
                    })}>
                        <MdNavigateBefore size={23} style={{color: 'white'}}/>
                    </Button>
                </div>
                <div className="question-header">
                    {questions[selectedQuestion].questionName}
                </div>
            </div>
            <hr/>
            {
                isLoading ? <div className="spinner-shell">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div> : topicAllAnswer.length > 0 ? <div className="questions-page-content">
                    {
                        topicAllAnswer.map((item) => {
                            return (
                                <Card key={item.id} className="answer-card">
                                    <Card.Body>
                                        <Card.Text>
                                            {item?.text}
                                        </Card.Text>
                                        <div className="card-bottom">
                                            <div className="like-icon">
                                                <FaHeart size={20} color="#F91880"
                                                         onClick={() => likeAnswer(item.id)}/>
                                            </div>
                                            <div className="like-count">{item.like}</div>
                                        </div>

                                        {/*TODO: create like button*/}
                                        {/*user click only once store pres id, quest id, answer id in local storage.*/}
                                        {/*if in local storage change button color*/}
                                        {/*if user un like delete from local storage*/}

                                    </Card.Body>
                                </Card>
                            )
                        })
                    }
                </div> : <div className="no-records">
                    There is no records to show
                </div>
            }
        </div>
    )
}

export default QuestionAnswersPage;
