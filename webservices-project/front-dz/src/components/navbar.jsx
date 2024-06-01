import protoTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "@/lib/hooks/useAuth";
import { LogOut, UserRound, Podcast } from "lucide-react";
import env from "@/config/env";
import axios from "axios";

const Navbar = (props) => {
  const { user } = useAuth();
  const navigator = useNavigate();

  function handleLogout(e) {
    e.preventDefault();

    axios
      .get(env.auth + "/logout")
      .then((res) => {
        if (res.status === 204) {
          navigator(0);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div className="navbar flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto mt-4 px-8">
      <div className="flex-1">
        <Link to="/">
          <img src="/logo.svg" alt="CloseCap.Me Logo" className="h-4 md:h-6" />
        </Link>
      </div>
      <div className="flex-none">
        {props.children ? (
          props.children
        ) : (
          <div className="flex flex-row gap-3 items-center select-none py-6">
            {user ? (
              <>
                <p className="mr-4">
                  Welcome <b>{user || ""}</b> 👋
                </p>
                <Link to="/profile">
                  <button className="btn btn-ghost">
                    <UserRound size={16} />
                    Profile
                  </button>
                </Link>
                <Link to="/plans">
                  <button className="btn btn-ghost">
                    <Podcast size={16} />
                    Plans
                  </button>
                </Link>
                <a href="_blank" onClick={handleLogout}>
                  <button className="btn btn-ghost">
                    <LogOut size={16} />
                    Logout
                  </button>
                </a>
              </>
            ) : (
              <>
                <Link
                  className="right-4 top-4 md:right-8 md:top-8 btn btn-ghost"
                  to="/auth/login"
                >
                  Login
                </Link>
                <Link to="/auth/signup">
                  <button className="btn btn-neutral">Sign Up</button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

Navbar.propTypes = {
  children: protoTypes.node,
};

export default Navbar;
