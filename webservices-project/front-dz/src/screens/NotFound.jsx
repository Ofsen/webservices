import Layout from "@/components/layout";
import { Link } from "react-router-dom";
import { MoveLeft } from "lucide-react";

export const NotFound = () => {
  return (
    <Layout>
      <section className="grid place-items-center h-full">
        <div>
          <h1 className="text-6xl lg:text-7xl font-bold">404</h1>
          <p className="text-xl mb-10">Page not found.</p>
          <Link to="/" className="flex items-center gap-2">
            <MoveLeft size={16} /> Go to the homepage
          </Link>
        </div>
      </section>
    </Layout>
  );
};
