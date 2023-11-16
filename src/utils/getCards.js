export const getCards = async () => {
    const cards = await (await fetch('https://a97mj46gc1.execute-api.us-east-1.amazonaws.com/dev/authoring/fcs')).json()
    
    return cards;
}

//
///http://localhost:5000/cards