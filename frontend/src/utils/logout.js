export async function logout() {
    const LOGOUT_URL = import.meta.env.VITE_BACKEND_URL + "logout";
    console.log(LOGOUT_URL)
    
    const response = await fetch(LOGOUT_URL, {
        method: "post",
        credentials: "include"
    })
    
    return await response.json()
}