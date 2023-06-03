import * as React from 'react';
import "./questionsAnswersPage.scss";
import {Button, Card} from "react-bootstrap";
import {useLocation, useNavigate} from "react-router-dom";
import {collection, doc, onSnapshot, runTransaction} from "firebase/firestore";
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
    const {state} = useLocation();
    const navigate = useNavigate();
    const hostName = window.location.origin;
    const {presentationId, questionId, question} = state;


    React.useEffect(() => {
        setUserLikeStorage(getItemFromLocalStorage());
    }, [topicAllAnswer])


    React.useEffect(() => {
        const unsub = onSnapshot(collection(db, ANSWERS_COLLECTION_NAME, presentationId, questionId), (doc) => {
            convertDBObjectToReactObject(doc.docs);
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
            const sfDocRef = doc(db, ANSWERS_COLLECTION_NAME, presentationId, questionId, answerId);

            const answerTransaction = await runTransaction(db, async (transaction) => {
                const sfDoc = await transaction.get(sfDocRef);
                if (!sfDoc.exists()) {
                    throw "Document does not exist!";
                }
                const newPopulation = decideIncreaseOrDecrease(answerId, sfDoc.data().like);
                transaction.update(sfDocRef, {like: newPopulation});
            });
            const newUserLikeItem = {}
            newUserLikeItem[questionId] = {}
            newUserLikeItem[questionId][sfDocRef.id] = 1;
            localStorage.setItem(presentationId, JSON.stringify(newUserLikeItem));
            console.log("Transaction successfully committed!");
        } catch (e) {
            console.log("Transaction failed: ", e);
        }
        console.log(answerId);
    }

    const likeColorDecider = (answerId: string) => {
        return userLikeStorage ? userLikeStorage[questionId] ? userLikeStorage[questionId][answerId] ? "red" : "gray" : "gray" : "gray";
    }

    return (
        <div className="questions-page">
            <div className="questions-page-header">
                <div className="return-button">
                    <Button onClick={() => navigate(-1)}>
                        <MdNavigateBefore size={23} style={{color: 'white'}}/>
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
                            <Card key={item.id} className="answer-card">
                                <Card.Body>
                                    <Card.Text>
                                        {item?.text}
                                    </Card.Text>
                                    <div className="card-bottom">
                                        <FaHeart size={20} color={likeColorDecider(item.id)}
                                                 onClick={() => likeAnswer(item.id)}/>
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
            </div>
        </div>
    )
}

export default QuestionAnswersPage;
