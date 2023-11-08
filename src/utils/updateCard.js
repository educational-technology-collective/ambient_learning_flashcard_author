//use async/await

export const updateCard = async (id, card, auth) => {
    console.log('UPDATE CARD ID:', id)
    console.log('UPDATE CARD CARD:', card)
    const updatedCard = await (await fetch(`https://a97mj46gc1.execute-api.us-east-1.amazonaws.com/dev/authoring/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auth
        },
        body: JSON.stringify(card)
    })).json()
    console.log('UPDATE CARD UPDATED CARD AFTER FETCH:', updatedCard)
    
    return updatedCard;
}