import * as React from 'react';
import {Button, Card} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {collection, doc, getDoc, onSnapshot, orderBy, query} from "firebase/firestore";
import {db} from "../../config/firebase-config";
import {ANSWERS_COLLECTION_NAME, PRESENTATIONS_COLLECTION_NAME} from "../presentation/PresentationCreatorService";
import {minZeroDecrease} from "../../Utils/Math";
import {MdNavigateBefore, MdNavigateNext} from "react-icons/md";
import "./presentationsPage.scss";
import {usePopUp} from "../../components/PopUp/usePopUp";
import {PopUp} from "../../components/PopUp/PopUp";
import QRCode from "react-qr-code";

interface IAnswer {
    text: string;
    like: number;
    id: string;
    isLiked: boolean;
}

const PresentationsPage = () => {
    const [topicAllAnswer, setTopicAllAnswer] = React.useState<IAnswer[]>([]);
    const [questions, setQuestions] = React.useState([]);
    const [selectedQuestion, setSelectedQuestion] = React.useState(0);
    const [isLoadingAnswers, setLoadingAnswers] = React.useState(true);
    const [isLoadingHeader, setLoadingHeader] = React.useState(true);
    const {presentationId} = useParams();
    const [isVisible, closeCallback, openPopUp] = usePopUp();


    React.useEffect(() => {
        const docRef = doc(db, PRESENTATIONS_COLLECTION_NAME, presentationId);
        getDoc(docRef).then(r => {
            const ques = r.get("questions").reduce((accum, item) => {
                accum.push({questionName: item.topic, questionId: item.id});
                return accum;
            }, []);
            setQuestions(ques);
            setLoadingHeader(false);
            const answersRef = collection(db, ANSWERS_COLLECTION_NAME, presentationId, ques[selectedQuestion]?.questionId + "")
            const q = query(answersRef, orderBy("timeStamp"));
            const unsub = onSnapshot(q, (doc) => {
                convertDBObjectToReactObject(doc.docs);
                setLoadingAnswers(false);
            });
        });
    }, []);

    React.useEffect(() => {
        setLoadingAnswers(true);
        const answersRef = collection(db, ANSWERS_COLLECTION_NAME, presentationId, questions[selectedQuestion]?.questionId + "")
        const q = query(answersRef, orderBy("timeStamp"));
        const unsub = onSnapshot(q, (doc) => {
            convertDBObjectToReactObject(doc.docs);
            setLoadingAnswers(false);
        });
        return () => unsub();
    }, [selectedQuestion]);

    const qrCodeData = React.useMemo(() => {
        const hostName = window.location.origin;
        console.log(hostName + "/" + "answers" + "/" + presentationId);
        return hostName + "/" + "answers" + "/" + presentationId;
    }, [presentationId]);

    const convertDBObjectToReactObject = (docs) => {
        const ans = docs.reduce((accum, item) => {
            let isLiked = false;
            const users = item.get("users");
            let likeCount = 0;
            if (users != null) {
                likeCount = Object.keys(users)?.length;
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

    const qrCodeButton = (): JSX.Element => {
        return <div className="qr-code-button">
            <Button className="qr-button" onClick={() => openPopUp()}>
                <i className="fas fa-qrcode"></i>
            </Button>
        </div>
    }
    return (
        <div className="presentation-page">
            {
                isLoadingHeader ? <div className="spinner-shell">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div> : <>
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
                            <span>
                                Next
                            </span>
                                    <MdNavigateNext size={23} style={{color: 'white'}}/></Button>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <div className="presentation-header">
                        <div>
                            {questions[selectedQuestion]?.questionName}
                        </div>
                    </div>
                </>
            }
            {
                isLoadingAnswers ? <div className="spinner-shell">
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
                                            <div className={"like-icon-pres liked"}>
                                                <i className="fas fa-heart fa-lg"/>
                                            </div>
                                            <div className="like-count">{item.like}</div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            )
                        })
                    }
                </div> : <div className="no-records">
                    There are no records to display
                </div>
            }
            {
                qrCodeButton()
            }
            <PopUp isVisible={isVisible} closeCallBack={closeCallback} body={<QRCode value={qrCodeData}/>
            }></PopUp>
        </div>
    )
}

export default PresentationsPage;
