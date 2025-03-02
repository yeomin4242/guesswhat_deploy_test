import { Metadata } from "next";
//import { BgGridContainer } from "@/components/common/bg-grid-container";
import AboutCards from "./_components/about-cards";

// TODO: metadata 있어보이게 수정
export const metadata: Metadata = {
  title: "About GuessWhat - Interactive Guessing Game Platform",
  description:
    "Learn about GuessWhat, the interactive platform where you can create, play, and share multimedia guessing games with friends.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Hero Section */}
        <section className="mb-12 text-start">
          <h1 className="mb-4 text-4xl font-bold">About GuessWhat</h1>
          <p className="text-xl text-default-600">
            An interactive platform that brings a new dimension to guessing
            games through multimedia experiences.
          </p>
        </section>
        <AboutCards />
      </div>

      <div className="mt-12 text-center">
        <p className="text-default-600">
          For any inquiries, please contact{" "}
          <a
            className="text-primary-500 hover:underline"
            href="mailto:proj.noname416@gmail.com"
          >
            proj.noname416@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
