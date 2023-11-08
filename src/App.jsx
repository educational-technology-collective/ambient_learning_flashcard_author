import React, { useState, useEffect } from 'react'
import { getCards } from './utils/getCards'
import { deleteCard } from './utils/deleteCard'
import { updateCard } from './utils/updateCard'
import { verifyUser } from './utils/verifyUser'

const cardSchema = {
    "_id": {
      "$oid": "65428ec11a8e75c201146485"
    },
    "content": {
      "question": "What is the purpose of the machine learning exploration described in the text?",
      "answer": [
        {
          "option": "To build a complex object recognition system",
          "isCorrect": false
        },
        {
          "option": "To train a classifier to distinguish between different types of fruit",
          "isCorrect": true
        },
        {
          "option": "To simulate features for instructional purposes",
          "isCorrect": false
        },
        {
          "option": "To create a dataset for fruit prediction",
          "isCorrect": false
        }
      ]
    },
    "kc": "siads542/An Example Machine Learning Problem/Moment 1",
    "lm_id": {
      "$oid": "654293151a8e75c2011ec240"
    },
    "source": "kevynct:ChatGPT gpt-3.5-turbo",
    "type": "mcq",
    "visibility": "development"
  }

const Question = ({ card, handleDeleteCard, handleUpdateCard, changeIsCorrect, changeQuestion, changeAnswer }) => {

    const letter = ['A', 'B', 'C', 'D']
    return(
        <div id='question-container'>
            <div id='question-wrapper'>
                <label id='question'>Question
                    <textarea 
                        id='question-textarea'
                        value={card.content.question}
                        onChange={(e) => changeQuestion(e, card._id, e.target.value)}
                    />
                </label>
                <div id='answers-container'>
                    <div id='answers-header'>
                        <div >Answers</div>
                        <div>Correct Answer</div>
                    </div>
                    <div id='answers-map'>
                {card.content.answer.map((answer, i) => {
                    const answerLabel = `answer-${letter[i]}`
                    return (
                        <div 
                            id={answerLabel}
                            key={`${card._id}${i}`}>
                            
                            <label className='answer-label'> {letter[i]}:
                                <textarea 
                                onChange={(e) => changeAnswer(e, card._id, answer.option)}
                                value={answer.option} />
                                <input
                                    type="radio" 
                                    name="answer" 
                                    checked={answer.isCorrect} 
                                    onChange={() => changeIsCorrect(card._id, answer.option)} />
                            </label>
                        </div>
                    )})}
                    </div>
                </div>
                <div id='question-buttons'>
                    <button id='question-update' onClick={() => handleUpdateCard(card._id)}>Update</button>
                    <button id='question-delete' onClick={() => handleDeleteCard(card._id)}>Delete</button>
                </div>

            </div>
        </div>
    )
}

const App = () => {

    const [cards, setCards] = useState([])
    const [index, setIndex] = useState(0)
    const [user, setUser] = useState('')
    const [auth, setAuth] = useState('')

    useEffect(() => {
        getCards().then(cards => {
            setCards(cards)
            setIndex(0)
        })
    }, [])
    const kc = cards[index] ? cards[index].kc : ''
    const header = kc.split('/').slice(1).join(' > ')

    const handleDeleteCard = (id) => {
        setCards(cards.filter(card => card._id !== id))
        deleteCard(id)
    }

    const handleUpdateCard = (id) => {
        updateCard(id, cards[index], auth)
    }

    const handleVerifyUser = () => {
        verifyUser(user)
            .then(res => {
                if (res.auth) {
                    setAuth(res.auth)
                } else {
                    alert('User not found')
                }
            })
    }

    const changeIsCorrect = (id, answerText) => {
        setCards(cards.map(card => {
            if (card._id === id) {
                card.content.answer.map(answer => {
                    if (answer.option === answerText) {
                        answer.isCorrect = !answer.isCorrect
                    } else {
                        answer.isCorrect = false
                    }
                })
            }
            return card
        }))
    }

    const changeQuestion = (e, id, questionText) => {
        const target = e.target;
        setCards(cards.map(card => {
            if (card._id === id) {
                card.content.question = questionText
            }
            return card
        }))
    }

    const changeAnswer = (e, id, answerText) => {
        const target = e.target;
        setCards(cards.map(card => {
            if (card._id === id) {
                card.content.answer.map(answer => {
                    if (answer.option === answerText) {
                        answer.option = target.value
                    }
                })
            }
            return card
        }))
    }

    const manuallyChangeIndex = (e) => {
        if (e.target.value > cards.length || e.target.value < 1 || isNaN(e.target.value)) return
        setIndex(e.target.value - 1)
    }

    return(
        <div id='container'>
            {cards.length > 0 ? (
                <>
                    <h4 id='card-header'>SIADS 542 {` > ${header}`}</h4>
                    <label id='user-label'>User: 
                        <input id='user-input' onChange={(e) => setUser(e.target.value)} value={user} />
                        <button id='user-button' onClick={handleVerifyUser} >Verify</button>
                    </label>
                    <Question 
                        card={cards[index]} 
                        handleDeleteCard={handleDeleteCard}
                        handleUpdateCard={handleUpdateCard}
                        changeIsCorrect={changeIsCorrect}
                        changeQuestion={changeQuestion}
                        changeAnswer={changeAnswer}
                    />
                    <div id='buttons-card-nav'>
                        <button id='button-card-prev' onClick={() => setIndex(index - 1)} disabled={index === 0}>Previous</button>
                        <div id='card-index'>
                            <input id='card-index-current' onChange={manuallyChangeIndex} value={index + 1} />
                            of
                            <div id='card-index-total'>{cards.length}</div>
                        </div>
                        <button id='button-card-next' onClick={() => setIndex(index + 1)} disabled={index === cards.length - 1}>Next</button>
                    </div>
                </>
            ) : (
                <h1>Loading...</h1>
            )}
        </div>
    )
}

export default App