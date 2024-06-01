import PropTypes from "prop-types";
import Navbar from "@/components/navbar";

export default function Layout({ children }) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto px-12 flex-grow">{children}</main>
      <footer className="footer footer-center p-4 text-base-content pt-12">
        <aside>
          <p>
            <a href="/" className="font-semibold">
              CloseCap.Me
            </a>{" "}
            ©️ 2024 - Made with 💖
          </p>
        </aside>
      </footer>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
