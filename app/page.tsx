"use client";

import { useEffect, useRef, useState } from "react";
import { wedding, guests } from "../data/wedding";

export default function Home() {
  const [opened, setOpened] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
const [isMuted, setIsMuted] = useState(false);

const RSVP_API =
  "https://script.google.com/macros/s/AKfycbz7j8XurCx22Kk6ghFAYx3BL2hTWuJ4fsIf2_1PgNgsKWNPn2iaufN29UszNAxIsQjU/exec";

const guestId =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("guest") || "G001"
    : "G001";

const guest = guests[guestId as keyof typeof guests];

const guestName = guest
  ? `${guest.title} ${guest.name}`
  : "Guest";
  useEffect(() => {
  fetch(`${RSVP_API}?guest=${encodeURIComponent(guestId)}`, {
    mode: "no-cors",
  }).catch((error) => {
    console.log("Could not record guest opening.", error);
  });
}, []);
const handleOpen = async () => {
  setOpened(true);

  if (audioRef.current) {
    audioRef.current.muted = false;

    try {
      await audioRef.current.play();
    } catch (error) {
      console.log("Music could not start automatically.", error);
    }
  }
};

const toggleMute = () => {
  if (!audioRef.current) return;
  

  audioRef.current.muted = !audioRef.current.muted;
  setIsMuted(audioRef.current.muted);
};
  const [timeLeft, setTimeLeft] = useState({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

useEffect(() => {
  const calculateTimeLeft = () => {
    const target = new Date(wedding.countdownDate).getTime();
    const now = new Date().getTime();

    const difference = target - now;

    if (difference <= 0) {
      setTimeLeft({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
      return;
    }

    setTimeLeft({
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor(
        (difference / (1000 * 60 * 60)) % 24
      ),
      minutes: Math.floor(
        (difference / (1000 * 60)) % 60
      ),
      seconds: Math.floor(
        (difference / 1000) % 60
      ),
    });
  };

  calculateTimeLeft();

  const timer = setInterval(calculateTimeLeft, 1000);

  return () => clearInterval(timer);
}, []);

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: wedding.colors.background,
        color: wedding.colors.text,
      }}
    >
      <audio
  ref={audioRef}
  src={wedding.music}
  loop
  preload="auto"
/>

{opened && (
  <button
    onClick={toggleMute}
    aria-label={isMuted ? "Unmute music" : "Mute music"}
    className="fixed right-5 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[#b99a72] bg-[#f5efe5]/90 text-lg shadow-lg backdrop-blur"
  >
    {isMuted ? "🔇" : "🔊"}
  </button>
)}
      {!opened ? (
        /* ================= OPENING ================= */
        <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">

         <p
  className="mb-4 text-xs uppercase tracking-[0.45em]"
  style={{ color: wedding.colors.accent }}
>
  A Story Written In Love
</p>

<h1 className="mb-4 font-serif text-4xl md:text-6xl">
   {guestName}
</h1>

<p className="mb-12 text-xs uppercase tracking-[0.35em] text-[#8d7a68]">
  You are invited
</p>

          {/* Envelope */}
          <button
            onClick={handleOpen}
            className="group relative h-52 w-80 cursor-pointer outline-none"
          >
            <div className="absolute bottom-0 left-1/2 h-5 w-64 -translate-x-1/2 rounded-full bg-black/10 blur-xl" />

            <div className="absolute bottom-0 left-0 h-44 w-full rounded-md border border-[#c9ad8c] bg-[#eadbc7] shadow-2xl transition duration-700 group-hover:-translate-y-2">

              <div className="absolute bottom-0 left-0 border-b-[88px] border-l-[160px] border-r-transparent border-t-transparent border-b-[#dfcbb1]" />

              <div className="absolute bottom-0 right-0 border-b-[88px] border-l-transparent border-r-[160px] border-t-transparent border-b-[#dfcbb1]" />

              <div className="absolute left-1/2 top-1/2 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-[#b99a72] bg-[#8c6b48] text-2xl text-[#f8efe2] shadow-lg transition duration-500 group-hover:scale-110">
                ♡
              </div>
            </div>

            <div className="absolute left-0 top-8 z-10 h-0 w-0 border-l-[160px] border-r-[160px] border-t-[90px] border-l-transparent border-r-transparent border-t-[#d8c0a1]" />
          </button>

          <button
            onClick={handleOpen}
            className="mt-10 border-b pb-2 text-xs uppercase tracking-[0.3em]"
            style={{ borderColor: wedding.colors.accent }}
          >
            Open Invitation
          </button>

          <p className="mt-6 text-xs tracking-widest text-[#9d8a77]">
            TAP TO BEGIN
          </p>
        </section>
      ) : (
        /* ================= INVITATION ================= */
        <div>

          {/* HERO */}
          <section className="flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center">

            <p
              className="mb-6 text-xs uppercase tracking-[0.5em]"
              style={{ color: wedding.colors.accent }}
            >
              Together with their families
            </p>

            <h1 className="font-serif text-6xl md:text-8xl">
              {wedding.bride}
            </h1>

            <div
              className="my-5 text-3xl"
              style={{ color: wedding.colors.accent }}
            >
              &
            </div>

            <h1 className="font-serif text-6xl md:text-8xl">
              {wedding.groom}
            </h1>

            <p className="mt-8 text-sm uppercase tracking-[0.35em]">
              Are Getting Married
            </p>

            <p className="mt-4 text-sm text-[#8d7a68]">
              {wedding.date} · {wedding.time}
            </p>

          </section>


          {/* ================= PHOTO ================= */}
          <section className="px-6 py-20">

            <div className="mx-auto max-w-3xl">

              <div className="overflow-hidden rounded-[2rem] shadow-2xl">
                <img
                  src={wedding.couplePhoto}
                  alt={`${wedding.bride} and ${wedding.groom}`}
                  className="h-[550px] w-full object-cover"
                />
              </div>

              <p
                className="mt-8 text-center font-serif text-2xl"
                style={{ color: wedding.colors.accent }}
              >
                A new chapter begins...
              </p>

            </div>

          </section>


          {/* ================= STORY ================= */}
          <section className="px-6 py-24 text-center">

            <p
              className="mb-5 text-xs uppercase tracking-[0.45em]"
              style={{ color: wedding.colors.accent }}
            >
              {wedding.story.title}
            </p>

            <p className="mx-auto max-w-xl font-serif text-2xl leading-relaxed md:text-3xl">
              {wedding.story.text}
            </p>

          </section>


          {/* ================= WEDDING DETAILS ================= */}
          <section className="px-6 py-24">

            <div className="mx-auto max-w-xl text-center">

              <p
                className="text-xs uppercase tracking-[0.45em]"
                style={{ color: wedding.colors.accent }}
              >
                The Wedding Day
              </p>

              <h2 className="mt-6 font-serif text-4xl md:text-5xl">
                {wedding.date}
              </h2>

              <p className="mt-4 text-lg">
                {wedding.time}
              </p>

              <div className="my-8 h-px w-20 mx-auto bg-[#b99a72]" />

              <h3 className="font-serif text-3xl">
                {wedding.venue}
              </h3>

              <p className="mt-3 text-[#8d7a68]">
                {wedding.address}
              </p>


              {/* LOCATION BUTTON */}
              <a
                href={wedding.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-block rounded-full border px-8 py-4 text-xs uppercase tracking-[0.25em] transition hover:bg-[#30251e] hover:text-white"
                style={{ borderColor: wedding.colors.accent }}
              >
                📍 View Location
              </a>

            </div>

          </section>

{/* ================= COUNTDOWN ================= */}
<section className="px-6 py-24 text-center">

  <p
    className="text-xs uppercase tracking-[0.45em]"
    style={{ color: wedding.colors.accent }}
  >
    Counting Down To Forever
  </p>

  <h2 className="mt-6 font-serif text-4xl md:text-5xl">
    The Big Day
  </h2>

  <div className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-4 md:grid-cols-4">

    <div className="rounded-2xl border border-[#d8c5ad] bg-white/30 p-6">
      <p className="font-serif text-4xl md:text-5xl">
        {timeLeft.days}
      </p>
      <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[#8d7a68]">
        Days
      </p>
    </div>

    <div className="rounded-2xl border border-[#d8c5ad] bg-white/30 p-6">
      <p className="font-serif text-4xl md:text-5xl">
        {String(timeLeft.hours).padStart(2, "0")}
      </p>
      <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[#8d7a68]">
        Hours
      </p>
    </div>

    <div className="rounded-2xl border border-[#d8c5ad] bg-white/30 p-6">
      <p className="font-serif text-4xl md:text-5xl">
        {String(timeLeft.minutes).padStart(2, "0")}
      </p>
      <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[#8d7a68]">
        Minutes
      </p>
    </div>

    <div className="rounded-2xl border border-[#d8c5ad] bg-white/30 p-6">
      <p className="font-serif text-4xl md:text-5xl">
        {String(timeLeft.seconds).padStart(2, "0")}
      </p>
      <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[#8d7a68]">
        Seconds
      </p>
    </div>

  </div>

</section>
{/* ==================== RSVP ==================== */}
<section className="px-6 py-24 text-center">
  <p
    className="text-xs uppercase tracking-[0.45em]"
    style={{ color: wedding.colors.accent }}
  >
    Kindly Respond
  </p>

  <h2 className="mt-4 font-serif text-4xl md:text-5xl">
    Will you be joining us?
  </h2>

  <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#8d7a68]">
    Your presence would mean so much to us.
  </p>

  <div className="mx-auto mt-10 flex max-w-md flex-col gap-4 sm:flex-row">
    <button
      onClick={() => {
        fetch(
          `${RSVP_API}?guest=${encodeURIComponent(guestId)}&response=YES`,
          { mode: "no-cors" }
        );
        alert("Thank you! We can't wait to celebrate with you. 🤍");
      }}
      className="flex-1 rounded-full border px-6 py-4 text-xs uppercase tracking-[0.25em] transition hover:bg-[#30251E] hover:text-white"
      style={{ borderColor: wedding.colors.accent }}
    >
      Yes, I'll be there
    </button>

    <button
      onClick={() => {
        fetch(
          `${RSVP_API}?guest=${encodeURIComponent(guestId)}&response=NO`,
          { mode: "no-cors" }
        );
        alert("Thank you for letting us know. 🤍");
      }}
      className="flex-1 rounded-full border px-6 py-4 text-xs uppercase tracking-[0.25em] transition hover:bg-[#30251E] hover:text-white"
      style={{ borderColor: wedding.colors.accent }}
    >
      Sorry, I can't attend
    </button>
  </div>
</section>

          {/* ================= FOOTER ================= */}
          <section className="px-6 py-24 text-center">

            <div className="mx-auto mb-8 h-px w-20 bg-[#b99a72]" />

            <p className="font-serif text-3xl">
              With Love
            </p>

            <p
              className="mt-4 text-sm uppercase tracking-[0.3em]"
              style={{ color: wedding.colors.accent }}
            >
              {wedding.bride} & {wedding.groom}
            </p>

            <button
              onClick={() => setOpened(false)}
              className="mt-12 text-xs uppercase tracking-[0.25em] underline underline-offset-8"
              style={{ color: wedding.colors.accent }}
            >
              Replay Invitation
            </button>

          </section>

        </div>
      )}
    </main>
  );
}