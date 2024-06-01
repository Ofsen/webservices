import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import Icons from "@/components/icons";
import useAuth from "@/lib/hooks/useAuth";
import env from "@/config/env";
import { ShieldX, X, ThumbsUp } from "lucide-react";
import axios from "axios";

const INTIAL_STATE = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

export default function Profile() {
  const { user } = useAuth();

  const [info, setInfo] = useState({ state: "", content: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [fields, setFields] = useState(INTIAL_STATE);

  function handleChange(event) {
    setFields((prev) => ({ ...prev, [event.target.id]: event.target.value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    axios
      .put(env.crud + "/user/" + fields._id, fields, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((data) => {
        if ("error" in data) {
          setInfo({ state: "error", content: data.error });
        } else {
          setInfo({ state: "success", content: data.message });
        }

        setFields;
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setInfo({ state: "error", content: err.message });
        setIsLoading(false);
      });
  }

  useEffect(() => {
    if (!isMounted) {
      axios.get(env.crud + "/user?email=" + user).then((data) => {
        const userInfo = data.data.data[0];
        setFields((prev) => ({
          ...prev,
          email: userInfo.email,
          name: userInfo.name,
          _id: userInfo._id,
        }));
        setIsMounted(true);
      });
    }

    return () => {
      setFields(INTIAL_STATE);
      setIsLoading(false);
      setIsMounted(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disabled =
    isLoading ||
    fields.password !== fields.passwordConfirm ||
    !fields.email ||
    !fields.name;

  return (
    <Layout>
      <section>
        <div className="hero lg:pt-18 pt-12">
          <div className="hero-content text-center">
            <div className="flex flex-col gap-2 w-80">
              <h1 className="text-4xl lg:text-5xl font-bold">Profile</h1>

              {info.state && (
                <div className="toast cursor-pointer" onClick={() => setInfo(null)}>
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
                    value={fields.email}
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
                    value={fields.name}
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
                    value={fields.password}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="password" className="label">
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
                    value={fields.passwordConfirm}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                <button className="btn btn-neutral bg-slate-600 mt-6" disabled={disabled}>
                  {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                  Update my profile
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
