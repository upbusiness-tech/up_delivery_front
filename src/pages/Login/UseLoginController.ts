import { useNavigate } from "react-router-dom";
import { AuthService } from "../../api/services/auth.service";
import { ROUTES_ENUM } from "../../routes/routes.enum";

export function UseLoginController() {
  const navigate = useNavigate();

  const signIn = async (email: string, password:string) => {
    const { access_token } = await AuthService.signIn(email, password)
    localStorage.setItem("token", access_token)
    navigate(ROUTES_ENUM.ORDERS)
  }

  return {
    navigate,
    signIn
  }
}
