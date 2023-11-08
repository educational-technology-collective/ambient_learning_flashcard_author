export const getCards = async () => {
    const cards = await (await fetch('http://localhost:5000/cards')).json()
    console.log('GET CARDS CARDS AFTER FETCH:', cards)
    
    return cards;
}
// 'http://localhost:5000/cards'
// 'https://a97mj46gc1.execute-api.us-east-1.amazonaws.com/dev/authoring/fcs'