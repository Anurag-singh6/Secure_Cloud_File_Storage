import React from "react";
import home from "../assets/home.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-radial-[at_50%_75%] from-gray-700 via-gray-800 to-[var(--background)] to-90% py-8 sm:py-12 md:py-16 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
            {/* left content */}
            <div className="space-y-4 sm:space-y-5 md:space-y-6 order-2 md:order-1 max-w-xl">
              <h1 className="text-3xl text-[var(--text-primary)] sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Secure Cloud File Storage for Your Data
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[var(--text-secondary)] md:text-[var(--text-secondary)]">
                Keep your files safe, encrypted, and accessible anytime.
              </p>
              <div className="pt-4 sm:pt-6">
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 sm:w-60 sm:px-8 py-2 sm:py-3 bg-[var(--primary)] text-[var(--text-primary)] font-bold rounded-lg hover:bg-[var(--primary-hover)] transition duration-300 transform hover:scale-105 cursor-pointer text-sm sm:text-base whitespace-nowrap"
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Right Visual */}
            <div className="flex justify-center items-center order-1 md:order-2 mb-6 md:mb-0">
              <img
                src={home}
                alt="cloud image"
                className="w-full max-w-md object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Why Choose SecureZilla?
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Discover the features that make our cloud storage the best choice for securing your files.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-[var(--accent)] rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">End-to-End Encryption</h3>
              <p className="text-[var(--text-secondary)]">
                Your files are encrypted before upload and remain secure in transit and at rest.
              </p>
            </div>
            <div className="text-center p-6 bg-[var(--accent)] rounded-lg shadow-lg">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Fast & Reliable</h3>
              <p className="text-[var(--text-secondary)]">
                Access your files instantly from anywhere with our high-speed cloud infrastructure.
              </p>
            </div>
            <div className="text-center p-6 bg-[var(--accent)] rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Multi-Factor Authentication</h3>
              <p className="text-[var(--text-secondary)]">
                Protect your account with advanced MFA to ensure only you can access your data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gradient-to-br from-gray-100 to-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              How It Works
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Get started with SecureZilla in just a few simple steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[var(--primary)] text-[var(--text-primary)] rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Sign Up</h3>
              <p className="text-[var(--text-secondary)]">
                Create your account and verify your identity with MFA.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[var(--primary)] text-[var(--text-primary)] rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Upload Files</h3>
              <p className="text-[var(--text-secondary)]">
                Securely upload your documents, images, and more to the cloud.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[var(--primary)] text-[var(--text-primary)] rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Access Anywhere</h3>
              <p className="text-[var(--text-secondary)]">
                Retrieve your files anytime, anywhere, on any device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Hear from our satisfied users about their experience with SecureZilla.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-[var(--accent)] rounded-lg shadow-lg">
              <p className="text-[var(--text-secondary)] mb-4">
                "SecureZilla has transformed how I store my important documents. The encryption is top-notch!"
              </p>
              <div className="font-semibold text-[var(--text-primary)]">- John Doe, Student</div>
            </div>
            <div className="p-6 bg-[var(--accent)] rounded-lg shadow-lg">
              <p className="text-[var(--text-secondary)] mb-4">
                "As a faculty member, I need reliable storage. SecureZilla delivers with speed and security."
              </p>
              <div className="font-semibold text-[var(--text-primary)]">- Jane Smith, Faculty</div>
            </div>
            <div className="p-6 bg-[var(--accent)] rounded-lg shadow-lg">
              <p className="text-[var(--text-secondary)] mb-4">
                "Easy to use and highly secure. Perfect for managing files across devices."
              </p>
              <div className="font-semibold text-[var(--text-primary)]">- Alex Johnson, Staff</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Ready to Secure Your Files?
          </h2>
          <p className="text-lg text-[var(--text-primary)] mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust SecureZilla for their file storage needs.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-3 bg-[var(--background)] text-[var(--text-primary)] font-bold rounded-lg hover:bg-gray-200 transition duration-300 transform hover:scale-105 cursor-pointer"
          >
            Sign Up Now
          </button>
        </div>
      </section>
    </>
  );
};

export default Home;
