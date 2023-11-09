import React, { useState, useEffect } from 'react'
import { getCards } from './utils/getCards'
import { deleteCard } from './utils/deleteCard'
import { updateCard } from './utils/updateCard'
import { verifyUser } from './utils/verifyUser'
import { xsvg, check } from './utils/svgs'

const emptyCard = {
    kc: '',
    content: {
        question: '',
        answer: [
            { option: '', isCorrect: false },
            { option: '', isCorrect: false },
            { option: '', isCorrect: false },
            { option: '', isCorrect: false }
        ]
    },
    verified: false
}

const Question = ({ card, handleDeleteCard, handleUpdateCard, handleVerifyFilter, show, auth, changeIsCorrect, changeQuestion, changeAnswer }) => {

    const letter = ['A', 'B', 'C', 'D']
    return(
        <div id='question-container'>
            <div id='question-wrapper'>
                <div id='filter-container'>
                    <button id='filter-all' className={show === 'all' ? 'tab' : ''} onClick={() => handleVerifyFilter('all')}>All</button>
                    <button id='filter-verified' className={show === 'verified' ? 'tab' : ''} onClick={() => handleVerifyFilter('verified')}>Verified</button>
                    <button id='filter-unverified' className={show === 'unverified' ? 'tab' : ''} onClick={() => handleVerifyFilter('unverified')}>Unverified</button>
                </div>
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
                    <label id='question-verified'>Verified:
                        {card.verified ? check : xsvg}
                    </label>
                    <button id='question-update' onClick={() => handleUpdateCard(card._id)} disabled={auth === '' ? true : false} >Update</button>
                    <button id='question-delete' onClick={() => handleDeleteCard(card._id)} disabled={auth === '' ? true : false} >Delete</button>
                </div>

            </div>
        </div>
    )
}

const App = () => {

    const [cards, setCards] = useState([])
    const [filteredCards, setFilteredCards] = useState([])
    const [show, setShow] = useState('all')
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

    const handleVerifyFilter = (filter) => {
        setShow(filter)
        setIndex(0)
    }

    useEffect(() => {
        if (show === 'all') {
            setFilteredCards(cards)
        } else if (show === 'verified') {
            setFilteredCards(cards.filter(card => card.verified))
        } else if (show === 'unverified') {
            setFilteredCards(cards.filter(card => !card.verified))
        }
    }, [show, cards])

    const handleDeleteCard = (id) => {
        setCards(cards.filter(card => card._id !== id))
        deleteCard(id)
        if (index === cards.length - 1) {
            setIndex(index - 1)
        }
    }

    const handleUpdateCard = (id) => {
        let verifiedCard = cards[index];
        verifiedCard.verified = true;
        setCards(cards.map(card => {
            if (card._id === id) {
                card.verified = true
            }
            return card
        }));
        updateCard(id, verifiedCard, auth)
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

    useEffect(() => {
        if (filteredCards.length === 0) {
            setIndex(0)
            setShow('all')
        }
    }, [filteredCards])

    if (show === 'verified' && filteredCards.length !== 0) {
        return(
            <div id='container'>
                <h4 id='card-header'>SIADS 542 {` > ${header}`}</h4>
                <label id='user-label'>User: 
                    <input id='user-input' type='text' onChange={(e) => setUser(e.target.value)} value={user} placeholder='uniqname' />
                    <button id='user-button' onClick={handleVerifyUser} >Verify</button>
                </label>
                
                <Question 
                    card={filteredCards[index]} 
                    handleDeleteCard={handleDeleteCard}
                    handleUpdateCard={handleUpdateCard}
                    handleVerifyFilter={handleVerifyFilter}
                    show={show}
                    auth={auth}
                    changeIsCorrect={changeIsCorrect}
                    changeQuestion={changeQuestion}
                    changeAnswer={changeAnswer}
                />
                <div id='buttons-card-nav'>
                    <button id='button-card-prev' onClick={() => setIndex(index - 1)} disabled={index === 0}>Previous</button>
                    <div id='card-index'>
                        <input id='card-index-current'  type='text'  onChange={manuallyChangeIndex} value={index + 1} />
                        of
                        <div id='card-index-total'>{filteredCards.length}</div>
                    </div>
                    <button id='button-card-next' onClick={() => setIndex(index + 1)} disabled={index === filteredCards.length - 1}>Next</button>
                </div>
            </div>
        )
    } else if (show === 'unverified'  && filteredCards.length !== 0) {
        return(
            <div id='container'>
                <h4 id='card-header'>SIADS 542 {` > ${header}`}</h4>
                <label id='user-label'>User: 
                    <input id='user-input'  type='text'  onChange={(e) => setUser(e.target.value)} value={user} placeholder='uniqname' />
                    <button id='user-button' onClick={handleVerifyUser} >Verify</button>
                </label>
                
                <Question 
                    card={filteredCards[index]} 
                    handleDeleteCard={handleDeleteCard}
                    handleUpdateCard={handleUpdateCard}
                    handleVerifyFilter={handleVerifyFilter}
                    show={show}
                    auth={auth}
                    changeIsCorrect={changeIsCorrect}
                    changeQuestion={changeQuestion}
                    changeAnswer={changeAnswer}
                />
                <div id='buttons-card-nav'>
                    <button id='button-card-prev' onClick={() => setIndex(index - 1)} disabled={index === 0}>Previous</button>
                    <div id='card-index'>
                        <input id='card-index-current'  type='text'  onChange={manuallyChangeIndex} value={index + 1} />
                        of
                        <div id='card-index-total'>{filteredCards.length}</div>
                    </div>
                    <button id='button-card-next' onClick={() => setIndex(index + 1)} disabled={index === filteredCards.length - 1}>Next</button>
                </div>
            </div>
        )
    } else return(
        <div id='container'>
            {cards.length > 0 ? (
                <>
                    <h4 id='card-header'>SIADS 542 {` > ${header}`}</h4>
                    <label id='user-label'>User: 
                        <input id='user-input'  type='text'  onChange={(e) => setUser(e.target.value)} value={user} placeholder='uniqname' />
                        <button id='user-button' onClick={handleVerifyUser} >Verify</button>
                    </label>
                    
                    <Question 
                        card={cards[index]} 
                        handleDeleteCard={handleDeleteCard}
                        handleUpdateCard={handleUpdateCard}
                        handleVerifyFilter={handleVerifyFilter}
                        show={show}
                        auth={auth}
                        changeIsCorrect={changeIsCorrect}
                        changeQuestion={changeQuestion}
                        changeAnswer={changeAnswer}
                    />
                    <div id='buttons-card-nav'>
                        <button id='button-card-prev' onClick={() => setIndex(index - 1)} disabled={index === 0}>Previous</button>
                        <div id='card-index'>
                            <input id='card-index-current' type='text'  onChange={manuallyChangeIndex} value={index + 1} />
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