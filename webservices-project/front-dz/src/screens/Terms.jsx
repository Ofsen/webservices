import { Link, useNavigate } from "react-router-dom";
import { MoveLeft } from "lucide-react";

export const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col h-screen">
      <div className="navbar flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto mt-4 ">
        <div className="flex-1 fixed">
          <Link onClick={() => navigate(-1)} className="flex items-center gap-2">
            <MoveLeft size={16} /> Go back
          </Link>
        </div>
      </div>
      <main className="container mx-auto px-12 flex-grow">
        <section className="flex justify-center">
          <div className="max-w-sm flex flex-col gap-3">
            <h1 className="text-2xl lg:text-3xl font-bold">Terms of Service</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore obcaecati,
              repudiandae, odio beatae dolorum dignissimos praesentium quisquam ut
              similique nulla reprehenderit saepe earum nihil. Modi repellendus nostrum
              quia at possimus?
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore obcaecati,
              repudiandae, odio beatae dolorum dignissimos praesentium quisquam ut
              similique nulla reprehenderit saepe earum nihil. Modi repellendus nostrum
              quia at possimus? Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Labore obcaecati, repudiandae, odio beatae dolorum dignissimos praesentium
              quisquam ut similique nulla reprehenderit saepe earum nihil. Modi
              repellendus nostrum quia at possimus?
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore obcaecati,
              repudiandae, odio beatae dolorum dignissimos praesentium quisquam ut
              similique nulla reprehenderit saepe earum nihil. Modi repellendus nostrum
              quia at possimus?
            </p>
          </div>
        </section>
      </main>
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
};
