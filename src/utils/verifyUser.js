// use async await
// https://a97mj46gc1.execute-api.us-east-1.amazonaws.com/dev/authoring/verifyUser/{userId}

export const verifyUser = async (userId) => {
    const user = await (await fetch(`https://a97mj46gc1.execute-api.us-east-1.amazonaws.com/dev/authoring/verifyUser/${userId}`)).json()
    console.log('VERIFY USER USER AFTER FETCH:', user)
    
    return user;
}