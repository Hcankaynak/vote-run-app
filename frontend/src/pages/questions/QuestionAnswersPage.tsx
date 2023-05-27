import * as React from 'react';
import "./questionsPage.scss";
import {GrReturn} from "react-icons/gr";
import {Button, Card} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";


const answers = [
    {
        answer: "dustry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to "
    },
    {
        answer: "ong established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as oppose"
    },
    {
        answer: "There are many variations of passage"
    },
    {
        answer: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem"
    },
    {
        answer: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has root"
    },
    {
        answer: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old."
    },
    {
        answer: "There are many variations of passages of Lorem Ipsum available, but "
    }
]

const QuestionAnswersPage = () => {
    const {presentationId, questionId} = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        console.log(questionId)

        console.log(presentationId)

    }, [questionId, presentationId])

    return (
        <div className="questions-page">
            <div className="questions-page-header">
                <div className="return-button">
                    <Button onClick={() => navigate(-1)}>
                        <GrReturn size={23}/>
                    </Button>
                </div>
                <div className="question-header">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </div>
            </div>
            <hr/>
            <div className="questions-page-content">
                {
                    answers.map((answer) => {
                        return (
                            <Card className="answer-card">
                                <Card.Body>{answer.answer}</Card.Body>
                            </Card>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default QuestionAnswersPage;
