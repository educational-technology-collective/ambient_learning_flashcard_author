import React, { useState, useEffect } from 'react'
import { getCards } from './utils/getCards'

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

const App = () => {

    const [cards, setCards] = useState([])
    const [index, setIndex] = useState(0)

    useEffect(() => {
        getCards().then(cards => {
            setCards(cards)
            setIndex(cards.length - 1)
        })
    }, [])

    const deleteCard = (id) => {
        setCards(cards.filter(card => card._id !== id))
        setIndex(index - 1)
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



    return(
        <div>
            {cards.length > 0 ? (
                <div>
                    <textarea 
                        value={cards[index].content.question}
                        onChange={(e) => changeQuestion(e, cards[index]._id, e.target.value)}
                    
                    />
                    {cards[index].content.answer.map((answer, i) => (
                        <div key={`${cards[index]._id}${i}`}>
                            
                            <div style={{display: 'flex', boxShadow: `0 0 2px 2px ${answer.isCorrect ? 'green': 'black'}`, margin: '10px 0'}}>
                                <input
                                    type="radio" 
                                    name="answer" 
                                    checked={answer.isCorrect} 
                                    onChange={() => changeIsCorrect(cards[index]._id, answer.option)} />
                                <textarea 
                                onChange={(e) => changeAnswer(e, cards[index]._id, answer.option)}
                                value={answer.option} />
                            </div>
                        </div>
                    ))}
                    <button onClick={() => deleteCard(cards[index]._id)}>Delete</button>
                    <button onClick={() => setIndex(index - 1)}>Next</button>
                </div>
            ) : (
                <h1>Loading...</h1>
            )}
        </div>
    )
}

export default App