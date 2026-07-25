import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Server Component — no interactivity is needed here, including once a
// video background is added (autoplay/muted/loop/playsInline are plain HTML
// attributes, not client state).
export function HeroSection({ image }: { image: StaticImageData }) {
  return (
    <section className="relative isolate flex h-[90vh] min-h-[640px] items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {/*
          FUTURE VIDEO INTEGRATION POINT
          Swap the <Image> below for a muted, looping background video once
          the cinematic clip is ready, e.g.:

            <video
              autoPlay
              muted
              loop
              playsInline
              poster={typeof image === "string" ? image : image.src}
              className="h-full w-full object-cover motion-reduce:hidden"
            >
              <source src="/videos/hero.mp4" type="video/mp4" />
            </video>

          Keep the <Image> below in the DOM as the poster / reduced-motion
          fallback (add `motion-reduce:hidden` to the <video> so it disappears
          for visitors with prefers-reduced-motion — the still image already
          renders underneath, no extra markup needed).
        */}
        <Image src={image} alt="Sternen Albisrieden Innenraum" fill sizes="100vw" priority className="object-cover" />
        <div className="absolute inset-0 bg-charcoal/45" />
      </div>

      <div className="container-page flex flex-col items-center px-6 text-center text-primary-foreground">
        <p className="text-xs uppercase tracking-[0.35em] text-primary-foreground/80">
          Restaurant Sternen · Zürich Albisrieden
        </p>
        <h1 className="mt-6 max-w-2xl font-serif text-4xl leading-[1.15] sm:text-5xl md:text-6xl lg:text-7xl">
          Wo das Quartier
          <br />
          zusammenkommt.
        </h1>
        <p className="mt-6 max-w-sm text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
          Schweizer Küche,
          <br />
          saisonale Gerichte
          <br />
          und herzliche Gastfreundschaft.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/reservation">Tisch reservieren</Link>
          </Button>
          <Link
            href="/speisekarte"
            className="inline-flex items-center gap-1 text-sm text-primary-foreground/90 underline-offset-4 hover:underline"
          >
            Speisekarte ansehen <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
