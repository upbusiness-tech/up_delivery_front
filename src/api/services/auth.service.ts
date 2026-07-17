import { api } from "../axios"

export const AuthService = {
  async signIn(email: string, password:string){
    
    const body = {
      restaurantEmail: email, 
      restaurantPassword: password
    }
    const {data} = await api.post(`/auth/signIn`, body);
    return data
  }
}