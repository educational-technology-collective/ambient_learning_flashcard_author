//use async/await

export const updateCard = async (id, card, auth) => {
    const updatedCard = await (await fetch(`https://a97mj46gc1.execute-api.us-east-1.amazonaws.com/dev/authoring/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auth
        },
        body: JSON.stringify(card)
    })).json()
    
    return updatedCard;
}