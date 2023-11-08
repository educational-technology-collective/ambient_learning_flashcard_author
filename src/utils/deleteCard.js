export const deleteCard = async (id, auth) => {
    console.log('DELETE CARD ID:', id)
    const card = await (await fetch(`https://a97mj46gc1.execute-api.us-east-1.amazonaws.com/dev/authoring/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auth
        },
    })).json()
    console.log('DELETE CARD CARD AFTER FETCH:', card)
    
    return card;
}