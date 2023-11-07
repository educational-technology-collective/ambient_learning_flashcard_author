export const getCards = async () => {
    const cards = await (await fetch('http://localhost:5000/cards')).json()
    console.log('GET CARDS CARDS AFTER FETCH:', cards)
    
    return cards;
}