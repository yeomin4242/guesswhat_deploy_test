"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { FC } from "react";

const AboutCards: FC = () => {
  return (
    <>
      {/* What is GuessWhat */}
      <Card className="bg-default-50 p-4">
        <CardHeader className="flex gap-3">
          <div>
            <h2 className="text-2xl font-bold">What is GuessWhat?</h2>
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-default-600">
            GuessWhat is a modern take on traditional guessing games,
            incorporating images, GIFs, and audio to create engaging and
            interactive experiences. Our platform allows users to both play and
            create their own multimedia guessing games, fostering a community of
            creative minds and puzzle enthusiasts.
          </p>
        </CardBody>
      </Card>

      {/* Core Features */}
      <Card className="bg-default-50 p-4">
        <CardHeader className="flex gap-3">
          <div>
            <h2 className="text-2xl font-bold">Core Features</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              {/* TODO: 밑의 구라가 섞인 홍보문구들을 실제로 구현하던가 밑의 문구 중 일부를 삭제하던가 해야함 */}
              <h3 className="mb-2 text-xl font-semibold">Game Playing</h3>
              <ul className="list-inside list-disc space-y-2 text-default-600">
                <li>Interactive multimedia questions</li>
                <li>Real-time feedback on answers</li>
                <li>Progress tracking</li>
                <li>Various game modes</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold">Game Creation</h3>
              <ul className="list-inside list-disc space-y-2 text-default-600">
                <li>Upload images, GIFs, or audio</li>
                <li>Set custom answers and hints</li>
                <li>Configure game settings</li>
                <li>Share with the community</li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* How It Works */}
      <Card className="bg-default-50 p-4">
        <CardHeader className="flex gap-3">
          <div>
            <h2 className="text-2xl font-bold">How It Works</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-xl font-semibold">1. Create</h3>
              <p className="text-default-600">
                Design your own guessing game by uploading media, setting
                answers, and configuring game settings. Make it as challenging
                or casual as you like!
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold">2. Play</h3>
              <p className="text-default-600">
                Browse through a variety of user-created games, challenge
                yourself with multimedia questions, and track your progress as
                you play.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold">3. Share</h3>
              <p className="text-default-600">
                Share your created games with friends or the community. Vote on
                games you enjoy and discover new favorites through our social
                features.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Join the Community */}
      <Card className="bg-primary-50 p-4">
        <CardBody className="py-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">Join Our Community</h2>
          <p className="mb-4 text-default-600">
            Ready to start creating and playing interactive guessing games? Join
            our growing community of creative minds!
          </p>
        </CardBody>
      </Card>
    </>
  );
};

export default AboutCards;
