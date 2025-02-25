import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function LoginForm({ className, onSubmit, loading, data, setData, errors, ...props }) {
  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={onSubmit} {...props}>
      <div className="flex flex-col items-center gap-1 text-center">
        <img
          src="/images/HPNCNEW.png"
          alt="Header Image"
          width={600}
          height={500}
          className="mb-1"
        />
        <div className="w-full max-w-sm bg-green-100 p-2 rounded-lg shadow-md text-center">
          <h6 className="font-bold text-green-700" style={{ fontFamily: "Roboto, sans-serif" }}>
            LOGIN
          </h6>
        </div>
      </div>

      {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
      {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="username" className="text-green-700">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            value={data.username}
            onChange={(e) => setData("username", e.target.value)}
            required
            className="border-green-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password" className="text-green-700">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={data.password}
            onChange={(e) => setData("password", e.target.value)}
            required
            className="border-green-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={data.remember || false}
            onCheckedChange={(checked) => setData("remember", checked)}
            className="text-green-600 border-green-300 focus:ring-green-500"
          />
          <Label htmlFor="remember" className="text-green-700 text-sm">
            Remember Me
          </Label>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 text-white hover:bg-green-800"
        >
          {loading ? "Loading..." : "Login"}
        </Button>
      </div>
    </form>
  );
}
