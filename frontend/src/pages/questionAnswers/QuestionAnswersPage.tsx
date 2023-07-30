import * as React from 'react';
import "./questionsAnswersPage.scss";
import {Button, Card} from "react-bootstrap";
import {useLocation, useNavigate} from "react-router-dom";
import {collection, doc, onSnapshot, orderBy, query, runTransaction} from "firebase/firestore";
import {db} from "../../config/firebase-config";
import {ANSWERS_COLLECTION_NAME} from "../presentation/PresentationCreatorService";
import {getItemFromLocalStorage} from "../../Utils/LocalStorage";
import {MdNavigateBefore} from "react-icons/md";
import usePromiseHandler from "../../hooks/PromiseHandler";
import {minZeroDecrease} from "../../Utils/Math";

interface IAnswer {
    text: string;
    like: number;
    id: string;
    isLiked: boolean;
}

const QuestionAnswersPage = () => {
    const [topicAllAnswer, setTopicAllAnswer] = React.useState<IAnswer[]>([]);
    const [userLikeStorage, setUserLikeStorage] = React.useState({});
    const [isLoading, setLoading] = React.useState(true);
    const {state} = useLocation();
    const navigate = useNavigate();
    const hostName = window.location.origin;
    const {presentationId, questions, selectedQuestion} = state;
    const userId = window.localStorage.getItem('userId');

    const [addNewPromise] = usePromiseHandler();


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
            let isLiked = false;
            const users = item.get("users");
            let likeCount = 0;
            if (users != null) {
                likeCount = Object.keys(users)?.length;
            }
            if (users != null && users[userId]) {
                isLiked = true;
            }
            accum.push({text: item.get("text"), like: likeCount, id: item.id, isLiked: isLiked});
            return accum;
        }, []);
        setTopicAllAnswer(ans);
    }

    const decideIncreaseOrDecrease = (likeCount: number, isIncrease: boolean): number => {
        if (isIncrease) {
            return likeCount + 1;
        }
        return minZeroDecrease(likeCount);
    }


    const updateCount = (isIncrease: boolean, answerId: string) => {
        try {
            const sfDocRef = doc(db, ANSWERS_COLLECTION_NAME, presentationId, questions[selectedQuestion]?.questionId.toString(), answerId);
            const answerTransaction = runTransaction(db, async (transaction) => {
                const sfDoc = await transaction.get(sfDocRef);
                if (!sfDoc.exists()) {
                    throw "Document does not exist!";
                }
                const newPopulation = decideIncreaseOrDecrease(sfDoc.data().like, isIncrease);
                const newUsers = sfDoc.data().users;
                if (!newUsers[userId] && isIncrease) {
                    newUsers[userId] = 1;
                } else if (newUsers[userId] && !isIncrease) {
                    delete newUsers[userId];
                }
                transaction.update(sfDocRef, {like: newPopulation, users: newUsers});
            });
            // addNewPromise(answerTransaction);
            console.log("Transaction successfully committed!");
        } catch (e) {
            console.log("Transaction failed: ", e);
        }
        console.log(answerId);
    }

    const generatePath = (presentationId) => {
        return "/answers" + "/" + presentationId;
    };

    const onClickLike = (answerId, isLiked: boolean) => {
        setTopicAllAnswer((prev) => {
            prev.find((item) => item.id === answerId).isLiked = !isLiked;
            return [...prev];
        })
        updateCount(!isLiked, answerId);
    }

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
                                            <div className={"like-icon " + (item.isLiked ? "liked" : "")}
                                                 onClick={() => onClickLike(item.id, item.isLiked)}>
                                                <i className="fas fa-heart fa-lg"/>
                                            </div>

                                            {/*<div className="like-count">{item.like}</div>*/}
                                        </div>
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
