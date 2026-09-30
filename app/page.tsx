import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { getServerSupabase } from "@/lib/supabase/server";
// import LightningWrapper from "@/components/LightningWrapper";
import DecryptedText from "@/components/DecryptedText";
import TextType from "@/components/TextType";
import PixelBlastWrapper from "@/components/PixelBlastWrapper";

export default async function HomePage() {
  let membersCount = 0;
  let eventsCount = 0;

  try {
    const supabase = getServerSupabase();
    if (supabase) {
      const [{ count: mCount }, { count: eCount }] = await Promise.all([
        supabase.from("members").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
      ]);
      if (typeof mCount === "number") membersCount = mCount;
      if (typeof eCount === "number") eventsCount = eCount;
    }
  } catch (err) {
    console.warn("HomePage count fetch fallback:", err);
  }

  return (
    <main>
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-6xl px-4 pb-16 pt-20">
        {/* Lightning Background (commented out) */}
        {/* <LightningWrapper /> */}

        {/* PixelBlast Background */}
        <PixelBlastWrapper />

        <div className="mx-auto relative max-w-3xl text-center space-y-6">
          {/* Typing Header */}
          <h1 className="text-balance bg-[linear-gradient(90deg,#00D0FF,#8A6CFF)] bg-clip-text text-5xl font-semibold text-transparent md:text-6xl">
            <TextType
              text={[
                "XL Pro Developers",
                "Build. Learn. Ship. Together",
                "Ship Ideas, Not Just Code.",
              ]}
              typingSpeed={30}
              deletingSpeed={35}
              pauseDuration={3000}
              showCursor
              cursorCharacter="_"
              loop
            />
          </h1>

          {/* Hover-Decrypted Text */}
          <DecryptedText
            text="XL Pro Community is a developer collective pushing boundaries with code, hardware, and product thinking. Join a league of builders who ship fast, collaborate, and level up together."
            animateOn="hover"
            className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
            encryptedClassName="text-muted-foreground/50 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
            parentClassName="block"
          />

          {/* CTA Buttons */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <a href="/members">
              <Button className="bg-primary text-primary-foreground hover:opacity-90">
                Meet Our Members
              </Button>
            </a>
            <a href="/events">
              <Button
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
              >
                View Events
              </Button>
            </a>
          </div>
        </div>
      </section>

   {/* Stats Section */}
         
                <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-20 md:grid-cols-3">
                  {[
                    { k: "Members", v: membersCount ?? 0 },
                    { k: "Events Hosted", v: eventsCount ?? 0 },
                    { k: "Participants", v: 280 },
                  ].map((stat) => (
                    <div
                      key={stat.k}
                      className={`
                        rounded-xl border border-border/60 bg-secondary/50 p-6
                        shadow-[0_0_24px_rgba(0,208,255,0.12)] backdrop-blur-md opacity-90
                        hover:shadow-[0_0_40px_rgba(0,208,255,0.2)] transition-shadow duration-300
                        relative overflow-hidden text-center
                      `}
                    >
                      {/* Header */}
                      <p className="text-sm font-medium uppercase text-muted-foreground tracking-wider">
                        {stat.k}
                      </p>
                      
                      {/* Value */}
                      <p className="mt-4 text-3xl md:text-4xl font-extrabold text-primary">
                        {stat.v}
                      </p>
                      
                      {/* Decorative Glow Circles */}
                      <div className="absolute -top-6 -left-6 w-20 h-20 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-[#8A6CFF]/20 rounded-full blur-3xl pointer-events-none" />
                    </div>
                  ))}
                </section>
                
          

      {/* About Section */}
      <section className="mx-auto max-w-4xl px-4 pb-24 text-center">
        <h2 className="text-2xl font-semibold">About</h2>
        <p className="mt-3 text-pretty text-muted-foreground">
          We’re a student-built developer community focused on collaboration, creativity, and shipping real projects.
        </p>
      </section>
    </main>
  );
}
