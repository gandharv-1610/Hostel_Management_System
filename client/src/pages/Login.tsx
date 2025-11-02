import { useLocation } from "wouter";
import LoginForm from "@/components/LoginForm";

export default function Login() {
  const [, setLocation] = useLocation();

  const handleLogin = (email: string, password: string) => {
    console.log("Login:", email, password);
    
    if (email.includes("admin")) {
      setLocation("/admin");
    } else if (email.includes("warden")) {
      setLocation("/warden");
    } else {
      setLocation("/student");
    }
  };

  return <LoginForm onLogin={handleLogin} />;
}
