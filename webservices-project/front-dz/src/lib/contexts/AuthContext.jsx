import { createContext, useEffect, useState } from "react";
import protoTypes from "prop-types";
import env from "@/config/env";
import axios from "axios";

export const UserContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(env.auth + "/authenticated").then((data) => {
      setUser(data.data.user);
      setLoading(false);
    });

    return () => {
      setUser(null);
      setLoading(true);
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {loading ? (
        <div className="grid h-screen  place-items-center">
          <span className="loading loading-infinity loading-lg text-pink-500"></span>
        </div>
      ) : (
        children
      )}
    </UserContext.Provider>
  );
}
AuthProvider.propTypes = {
  children: protoTypes.node.isRequired,
};
