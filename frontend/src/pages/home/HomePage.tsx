import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./homepage.scss";
import {useNavigate} from "react-router-dom";
import {collection, getDocs, orderBy, query, where} from "firebase/firestore";
import {ANSWERS_COLLECTION_NAME, PRESENTATIONS_COLLECTION_NAME} from "../presentation/PresentationCreatorService";
import {Button, Card} from "react-bootstrap";
import {db} from "../../config/firebase-config";
import SearchBar from "../../components/SearchBar/SearchBar";
import useAuthenticate from "../../hooks/Authentication";
import {CSVLink} from "react-csv";

export interface IHomePage {
    userId: string;
}

const HomePage = (props: IHomePage) => {
    const [presentations, setPresentations] = React.useState([]);
    const [isLoading, setLoading] = React.useState(true);
    const [download, setDownload] = React.useState(false);
    const [searchedText, setSearchedText] = React.useState("");
    const [csvRows, setCSVRows] = React.useState([]);
    const [downloadData, setDownloadData] = React.useState([]);
    const [totalQuestionCount, setTotalQuestionCount] = React.useState({} as { questions: [], presentationName: string });
    const [currentQuestionCount, setCurrentQuestionCount] = React.useState(0);
    const csvLink = React.createRef()

    const navigate = useNavigate();
    useAuthenticate({forceLogin: true})

    React.useEffect(() => {
        if (csvRows.length > 0 && currentQuestionCount == totalQuestionCount?.questions.length) {
            console.log(csvRows);
            setDownloadData(csvRows.map((item) => [item]))
            setDownload(true)
        }
    }, [csvRows])

    React.useEffect(() => {
        if (download) {
            // @ts-ignore
            csvLink.current.link.click();
            setDownload(false)
            setTotalQuestionCount({presentationName: "", questions: []})
            setCurrentQuestionCount(0)
            setCSVRows([])
        }
    }, [download])

    React.useEffect(() => {
        const presentationsRef = collection(db, PRESENTATIONS_COLLECTION_NAME);
        const q = query(presentationsRef, where("userId", "==", props.userId));
        const querySnapshot = getDocs(q);
        querySnapshot.then(value => {
            value.docs.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
            });
            setLoading(false);
            setPresentations(value.docs);
        }).catch(reason => console.log(reason));
    }, [props.userId])

    const generatePath = (presentationId) => {
        const hostName = window.location.origin;
        // console.log(hostName + "/" + "answers" + "/" + presentationId);
        return hostName + "/" + "presentations" + "/" + presentationId;
    };

    const downloadAsCSV = async (presentation) => {
        setTotalQuestionCount(presentation?.data());
        const answers = [];
        presentation?.data()?.questions.map((question, index) => {
            const answersRef = collection(db, ANSWERS_COLLECTION_NAME, presentation.id, question?.id + "")
            const q = query(answersRef, orderBy("timeStamp"));
            getDocs(q).then(r => {
                setCurrentQuestionCount((prevState => {
                    return prevState + 1;
                }))
                answers.push("");
                answers.push(question.topic)
                r.docs.map((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    answers.push(doc.data()?.text)
                });
                setCSVRows([...answers]);
            });
        });
    }

    const renderPresentations = () => {
        if (isLoading) {
            return (
                <div className="spinner-shell">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            );
        }
        return (
            <div className="home-page-presentations">
                {
                    presentations.filter((value) => value.data()?.presentationName.toLocaleLowerCase().includes(searchedText.toLocaleLowerCase())).map((item) => {
                        return (
                            <Card key={item.id} className="presentation-card">
                                <Card.Body>
                                    <Card.Text>
                                        {item?.data()?.presentationName}
                                    </Card.Text>
                                    <Button onClick={() => {
                                        navigate("/qrcode", {
                                            state: {
                                                presentationId: item.id
                                            }
                                        })
                                    }}>Go To QR</Button>
                                    <Button href={generatePath(item.id)}>Go To Presentation</Button>
                                    <Button onClick={() => downloadAsCSV(item)}>
                                        <i className="fas fa-download"/>
                                    </Button>

                                    <div className="card-bottom">
                                        {"Questions: " + item?.data()?.questions.length}
                                        <div className="like-count">{item.like}</div>
                                    </div>
                                </Card.Body>
                            </Card>
                        )
                    })
                }
            </div>
        )
    }

    return (
        <div className="home-page">
            <div className="home-page-content">
                <div className="search-bar-shell">
                    <SearchBar setText={setSearchedText}/>
                </div>
                {
                    renderPresentations()
                }
                <CSVLink
                    data={downloadData}
                    filename={totalQuestionCount.presentationName}
                    className="hidden"
                    ref={csvLink}
                    target="_blank"
                />
            </div>
        </div>
    );
};

export default HomePage;
