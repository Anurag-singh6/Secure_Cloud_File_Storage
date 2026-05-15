import React from 'react';
import secureabout from "../assets/secureabout.jpg";
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-[var(--background)] text-[var(--text-primary)]">
      <section className="bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6 text-center lg:text-left">
            <p className="inline-flex rounded-full bg-indigo-500/20 px-4 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">
              About SecureZilla
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              Secure cloud storage built for students and faculty.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-gray-300">
              SecureZilla helps you protect your most important documents with powerful encryption, multi-factor authentication, and intuitive access controls. We are committed to keeping your data safe while making collaboration effortless.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                Get Started
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
            <img
              src={secureabout}
              alt="SecureZilla overview"
              className="w-full rounded-3xl object-cover shadow-xl"
            />
            <div className="absolute -bottom-6 left-6 flex flex-col gap-2 rounded-3xl bg-gray-900/95 p-5 text-white shadow-xl shadow-black/40 sm:left-10">
              <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">Trusted by users</p>
              <p className="text-2xl font-semibold">10K+ secure file uploads</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              Our mission
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[var(--text-secondary)]">
              We exist to create a safer, easier way for institutions and individuals to store and share sensitive files. Our focus is security, reliability, and a seamless user experience.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl border border-gray-200/10 bg-[var(--accent)] p-8 shadow-lg shadow-black/10">
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Security First</h3>
              <p className="text-[var(--text-secondary)] leading-7">
                Advanced encryption and MFA keep every document protected from unauthorized access.
              </p>
            </div>
            <div className="rounded-3xl border border-gray-200/10 bg-[var(--accent)] p-8 shadow-lg shadow-black/10">
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Accessible Anytime</h3>
              <p className="text-[var(--text-secondary)] leading-7">
                Your files are available across devices with fast upload and download performance.
              </p>
            </div>
            <div className="rounded-3xl border border-gray-200/10 bg-[var(--accent)] p-8 shadow-lg shadow-black/10">
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Designed for teams</h3>
              <p className="text-[var(--text-secondary)] leading-7">
                Role-based access and secure sharing let faculty and students collaborate easily.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400">Our story</p>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Built for educational institutions and secure teams.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-gray-300">
              SecureZilla started with a simple idea: make file storage secure without sacrificing usability. From encrypted uploads to robust user management, every feature is crafted to support safe collaboration.
            </p>
          </div>
          <div className="grid gap-6">
            <div className="rounded-3xl bg-white/5 p-8 text-white shadow-2xl shadow-black/20">
              <p className="text-4xl font-bold">99.99%</p>
              <p className="mt-2 text-[var(--text-secondary)]">Uptime and availability for continuous access.</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-8 text-white shadow-2xl shadow-black/20">
              <p className="text-4xl font-bold">MFA Strong</p>
              <p className="mt-2 text-[var(--text-secondary)]">Secure sign-in with multi-factor authentication for every user.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;