import { Card } from "@/components/ui/Card";
import { SplineScene } from "@/components/ui/SplineScene";
import { Spotlight } from "@/components/ui/Spotlight";

export const metadata = {
  title: "Spline Demo · DoGame",
};

export default function SplineDemoPage() {
  return (
    <main id="main" className="min-h-dvh bg-clay">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <Card
          className="relative h-[500px] w-full overflow-hidden border-transparent !bg-black/95 p-0 text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]"
        >
          <Spotlight
            className="-top-40 left-0 md:-top-20 md:left-60"
            fill="white"
          />

          <div className="flex h-full">
            <div className="relative z-10 flex flex-1 flex-col justify-center p-8">
              <h1 className="bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                Interactive 3D
              </h1>
              <p className="mt-4 max-w-lg text-neutral-300">
                Bring your UI to life with beautiful 3D scenes. Create immersive
                experiences that capture attention and enhance your design.
              </p>
            </div>

            <div className="relative flex-1">
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="h-full w-full"
              />
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
