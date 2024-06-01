import Uploader from "@/components/uploader";
import Layout from "@/components/layout";

export default function Home() {
  return (
    <Layout>
      <section>
        <div className="hero lg:pt-18 pt-12">
          <div className="hero-content text-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl lg:text-5xl font-bold">
                Subtitles{"  "}
                <span className="before:block before:absolute before:-inset-2 before:-skew-x-3 before:bg-pink-600 relative inline-block">
                  <span className="relative text-white">Everywhere!</span>
                </span>
              </h1>
              <p className="py-6 text-xl mb-10">
                Add <b>subtitles</b> to you videos easily with <b>AI</b>.
                <br />
                Just upload your video and we will do the rest.
              </p>
              <Uploader />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
