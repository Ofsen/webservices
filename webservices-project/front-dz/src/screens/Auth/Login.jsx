import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuth from "@/lib/hooks/useAuth";
import Icons from "@/components/icons";
import env from "@/config/env";
import Layout from "@/components/layout";
import { ShieldX, X, ThumbsUp } from "lucide-react";
import axios from "axios";
import useQuery from "../../lib/hooks/useQuery";

export function LoginScreen() {
  const [info, setInfo] = useState({ state: "", content: "" });
  const { user, setUser } = useAuth();
  const navigator = useNavigate();

  const query = useQuery();

  useEffect(() => {
    const error = query.get("error") || "";
    if (error) setInfo({ state: "error", content: error });

    const success = query.get("success") || "";
    if (success) setInfo({ state: "success", content: success });

    return () => {
      setInfo({ state: "", content: "" });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (user) {
    return <Navigate to={"/"} replace />;
  }

  function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    if (!email || !password) {
      setInfo({ state: "error", content: "Please fill in all fields" });
      return;
    }

    axios
      .post(
        env.auth + "/auth/login",
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if ("error" in res.data) {
          setInfo({ state: "error", content: res.data.error });
        } else {
          axios
            .get(env.auth + "/authenticated", { withCredentials: true })
            .then((res) => {
              setUser(res.data.user);
              setInfo({
                state: "success",
                content: "Log in successful, redirecting you to the homepage...",
              });
              navigator("/", { replace: true });
            })
            .catch((err) => {
              console.log(err);
              setInfo({
                state: "error",
                content: "Something bad happened, please try again",
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        setInfo({ state: "error", content: "Something bad happened, please try again" });
      });
  }

  return (
    <Layout>
      <section>
        <div className="hero lg:pt-18 pt-12">
          <div className="hero-content text-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl lg:text-4xl font-bold">Login</h1>
              <p className="text-sm text-muted-foreground">
                Enter your email & password below to login to your account
              </p>

              {info.state && (
                <div
                  className="toast cursor-pointer"
                  onClick={() => setInfo({ state: "", content: "" })}
                >
                  <div
                    className={`alert ${
                      info.state === "error"
                        ? "alert-error"
                        : info.state === "success"
                        ? "alert-success"
                        : "alert-warning"
                    } mt-1 text-white`}
                  >
                    {info.state === "error" && <ShieldX />}
                    {info.state === "success" && <ThumbsUp />}
                    <span className="pr-2">
                      <b>{info.state[0].toUpperCase() + info.state.slice(1)}!</b>{" "}
                      {info.content}
                    </span>
                    <X size={16} />
                  </div>
                </div>
              )}

              <form onSubmit={handleLogin} className="grid">
                <div className="form-control">
                  <label htmlFor="email" className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    type="email"
                    className="input input-bordered"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="password" className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    id="password"
                    name="password"
                    placeholder="***"
                    type="password"
                    className="input input-bordered"
                    autoCapitalize="none"
                    autoComplete="password"
                    autoCorrect="off"
                  />
                </div>
                <button type="submit" className="btn btn-neutral mt-6">
                  Login
                </button>
              </form>
              <p className="px-8 text-center text-sm text-muted-foreground">
                Not registered yet?{" "}
                <Link
                  to="/auth/signup"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign up
                </Link>
              </p>
              <div className="divider">Or continue with</div>
              <div className="grid gap-1">
                <a href={env.auth + "/auth/google"}>
                  <button
                    className="btn btn-outline border-slate-300 w-full"
                    type="button"
                  >
                    <Icons.google className="mr-2 h-4 w-4" />
                    Google
                  </button>
                </a>
                <a href={env.auth + "/auth/facebook"}>
                  <button
                    className="btn btn-outline border-slate-300 w-full"
                    type="button"
                  >
                    <Icons.facebook className="mr-2 h-4 w-4" />
                    Facebook
                  </button>
                </a>
                <a href={env.auth + "/auth/x"}>
                  <button
                    className="btn btn-outline border-slate-300 w-full"
                    type="button"
                  >
                    <Icons.twitter className="mr-2 h-4 w-4" />
                    Twitter / X
                  </button>
                </a>
                <a href={env.auth + "/auth/github"}>
                  <button
                    className="btn btn-outline border-slate-300 w-full"
                    type="button"
                  >
                    <Icons.gitHub className="mr-2 h-4 w-4" />
                    Github
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By logging in, you agree to our{" "}
          <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </Layout>
  );
}
