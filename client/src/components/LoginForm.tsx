import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, RefreshCw } from "lucide-react";

interface LoginFormProps {
  onLogin?: (email: string, password: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaValue, setCaptchaValue] = useState(generateCaptcha());

  function generateCaptcha() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  function handleRefreshCaptcha() {
    setCaptchaValue(generateCaptcha());
    setCaptcha("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (captcha.toUpperCase() !== captchaValue) {
      alert("Invalid CAPTCHA");
      return;
    }
    console.log("Login attempt:", { email, password });
    onLogin?.(email, password);
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/hostel-bg.jpg)`,
      }}
    >
      <Card className="w-full max-w-md shadow-2xl backdrop-blur-sm bg-card/95">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <img src="/logo.png" alt="SVNIT Logo" className="h-20 w-20 object-contain" />
          </div>
          <div>
            <CardTitle className="text-2xl">SVNIT Hostel Portal</CardTitle>
            <CardDescription>Sign in with your institute email</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" data-testid="label-email">Institute Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="u24cs100@coes.svnit.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-email"
                className="h-12"
              />
              <p className="text-xs text-muted-foreground">Format: rollno@dept.svnit.ac.in</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" data-testid="label-password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="input-password"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="captcha" data-testid="label-captcha">CAPTCHA</Label>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-12 bg-muted rounded-md flex items-center justify-center font-mono text-lg font-semibold select-none" data-testid="text-captcha-value">
                    {captchaValue}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleRefreshCaptcha}
                    data-testid="button-refresh-captcha"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Input
                id="captcha"
                type="text"
                placeholder="Enter CAPTCHA"
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                required
                data-testid="input-captcha"
                className="h-12"
              />
            </div>

            <Button type="submit" className="w-full h-12" data-testid="button-login">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
