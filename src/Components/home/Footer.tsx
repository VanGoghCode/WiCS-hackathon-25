import React, { useState } from "react";
import {
  GithubIcon,
  TwitterIcon,
  InstagramIcon,
  MailIcon,
  LinkedInIcon,
  VIcon,
} from "../../assets/SocialIcons/Icons";

const Footer: React.FC = () => {
  const [copySuccess, setCopySuccess] = useState(false);
  const emailAddress = "your.email@example.com"; // Replace with your actual email address

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard
      .writeText(emailAddress)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      })
      .catch((err) => {
        console.error("Failed to copy email: ", err);
      });
  };

  return (
    <footer className="wood-panel p-6 mt-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-bold text-amber-100 mb-2">
              Wooden Wardrobe
            </h2>
            <p className="text-sm text-amber-200">
              Your personal closet organizer and outfit generator
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            <div>
              <h3 className="font-medium text-amber-100 mb-2">Navigation</h3>
              <ul className="space-y-1">
                <li>
                  <a
                    href="#"
                    className="text-sm text-amber-200 hover:text-white"
                  >
                    My Wardrobe
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-amber-200 hover:text-white"
                  >
                    Outfit Ideas
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-amber-200 hover:text-white"
                  >
                    Saved Outfits
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-amber-100 mb-2">Features</h3>
              <ul className="space-y-1">
                <li>
                  <a
                    href="#"
                    className="text-sm text-amber-200 hover:text-white"
                  >
                    AI Recommendations
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-amber-200 hover:text-white"
                  >
                    Seasonal Looks
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-amber-200 hover:text-white"
                  >
                    Style Analysis
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-amber-100 mb-2">Contact</h3>
              <ul className="space-y-1">
                <li>
                  <a
                    href="#"
                    className="text-sm text-amber-200 hover:text-white"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-amber-200 hover:text-white"
                  >
                    Email Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-amber-200 hover:text-white"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6 pt-6 border-t border-amber-700">
          <div className="flex gap-4">
            <a
              href="https://github.com/VanGoghCode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-200 hover:text-white"
            >
              <GithubIcon />
            </a>
            <a
              href="https://x.com/vangoghcode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-200 hover:text-white"
            >
              <TwitterIcon />
            </a>
            <a
              href="https://www.instagram.com/k_.k_thummar/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-200 hover:text-white"
            >
              <InstagramIcon />
            </a>
            <a
              href="#"
              onClick={handleCopyEmail}
              className="text-amber-200 hover:text-white relative"
              aria-label="Copy email address"
            >
              <MailIcon />
              {copySuccess && (
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-amber-800 text-amber-100 px-2 py-1 rounded text-xs whitespace-nowrap">
                  Email copied!
                </span>
              )}
            </a>
            <a
              href="https://www.linkedin.com/in/kirtankumar-thummar/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-200 hover:text-white"
            >
              <LinkedInIcon />
            </a>
            <a
              href="https://vangoghcode.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-200 hover:text-white"
            >
              <VIcon />
            </a>
          </div>
        </div>

        <div className="text-center mt-4 text-xs text-amber-300">
          © {new Date().getFullYear()} Wooden Wardrobe. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
