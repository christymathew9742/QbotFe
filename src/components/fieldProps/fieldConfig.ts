import { customInputStyles } from "./fieldPropsStyles"

export const FieldConfig:any = {
    username: { name: "username", label: "User name", type: "text", size: 12 , style: customInputStyles},
    email: { name: "email", label: "Email", type: "email", size: 12, style: customInputStyles },
    password: { name: "password", label: "Password", type: "password", size: 12 , style: customInputStyles},
    confirmPassword: { name: "confirmPassword", label: "Confirm password", type: "password", size: 12 , style: customInputStyles},
}
