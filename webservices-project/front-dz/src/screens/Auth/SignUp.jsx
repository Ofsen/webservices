import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import Icons from "@/components/icons";
import env from "@/config/env";
import Layout from "@/components/layout";
import { ShieldX, X, ThumbsUp } from "lucide-react";
import axios from "axios";

export function SignUpScreen() {
  const [info, setInfo] = useState({ state: "", content: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const navigator = useNavigate();

  function handleChange(event) {
    setFields((prev) => ({ ...prev, [event.target.id]: event.target.value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    axios
      .post(env.crud + "/user", fields, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((data) => {
        if (data.status === 200) {
          navigator("/auth/login?success=Account created successfully, Please log in");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        // eslint-disable-next-line no-unsafe-optional-chaining
        if ("error" in err.response?.data) {
          setInfo({ state: "error", content: err.response.data.error });
        }
        setIsLoading(false);
      });
  }

  return (
    <Layout>
      <section>
        <div className="hero lg:pt-18 pt-12">
          <div className="hero-content text-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl lg:text-4xl font-bold">Create an account</h1>
              <p className="text-sm text-muted-foreground">
                Enter a your email, name & password below to create your account
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

              <form onSubmit={onSubmit} className="grid mt-4">
                <div className="form-control">
                  <label htmlFor="email" className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    className="input input-bordered"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="name" className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    id="name"
                    placeholder="John Doe"
                    type="text"
                    className="input input-bordered"
                    autoCapitalize="none"
                    autoComplete="name"
                    autoCorrect="off"
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="password" className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    id="password"
                    placeholder="***"
                    type="password"
                    className="input input-bordered"
                    autoCapitalize="none"
                    autoComplete="password"
                    autoCorrect="off"
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="passwordConfirm" className="label">
                    <span className="label-text">Password (confirm)</span>
                  </label>
                  <input
                    id="passwordConfirm"
                    placeholder="***"
                    type="password"
                    className="input input-bordered"
                    autoCapitalize="none"
                    autoComplete="passwordConfirm"
                    autoCorrect="off"
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                <button
                  className="btn btn-neutral mt-6"
                  disabled={isLoading || fields.password !== fields.passwordConfirm}
                >
                  {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                  Sign Up
                </button>
              </form>
              <p className="px-8 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  log in
                </Link>
              </p>
            </div>
          </div>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By registering, you agree to our{" "}
          <a href="/terms" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </a>
          .
        </p>
      </section>
    </Layout>
  );
}
