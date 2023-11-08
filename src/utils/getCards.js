export const getCards = async () => {
    const cards = await (await fetch('https://a97mj46gc1.execute-api.us-east-1.amazonaws.com/dev/authoring/fcs')).json()
    console.log('GET CARDS CARDS AFTER FETCH:', cards)
    
    return cards;
}
