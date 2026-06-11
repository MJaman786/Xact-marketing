import { SIGNUP } from "../../constants/urls"
import makeRequest from "../../utils/helpers/MakeRequest"

interface Prop {
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    phone: string
}

const signup = async () => {
    const res = await makeRequest({
        method:'POST',
        pathname:SIGNUP
    })
}