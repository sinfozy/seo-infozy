"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Left - Logo + tagline */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Logo />
            </Link>
            <p className="text-gray-400 mb-2">
              Making <span className="text-blue-400">SEO</span> data simple
            </p>
            <p className="text-gray-400">
              Email:{" "}
              <a
                href="mailto:contact@serpok.com"
                className="text-white hover:underline"
              >
                sales@infozysms.com
              </a>
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-4 text-gray-400">
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.facebook.com/profile.php?id=61579735049921"
                aria-label="Visit our Facebook"
                className="transition-opacity hover:opacity-80"
              >
                <FaFacebook className="h-7 w-7" />
              </Link>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.instagram.com/info.zy/"
                aria-label="Visit our Instagram"
                className="transition-opacity hover:opacity-80"
              >
                <FaInstagram className="h-7 w-7" />
              </Link>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://x.com/INFOZYSMS"
                aria-label="Visit our X / Twitter"
                className="transition-opacity hover:opacity-80"
              >
                <FaXTwitter className="h-7 w-7" />
              </Link>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.linkedin.com/in/infozy-sms-ai-intellisoft-5369a1383/"
                aria-label="Visit our LinkedIn"
                className="transition-opacity hover:opacity-80"
              >
                <FaLinkedin className="h-7 w-7" />
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    aria-label="Visit our Zalo"
                    className="transition-opacity hover:opacity-80 cursor-pointer"
                    onClick={() => {}}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="34"
                      height="34"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#2962ff"
                        d="M15,36V6.827l-1.211-0.811C8.64,8.083,5,13.112,5,19v10c0,7.732,6.268,14,14,14h10	c4.722,0,8.883-2.348,11.417-5.931V36H15z"
                      ></path>
                      <path
                        fill="#eee"
                        d="M29,5H19c-1.845,0-3.601,0.366-5.214,1.014C10.453,9.25,8,14.528,8,19	c0,6.771,0.936,10.735,3.712,14.607c0.216,0.301,0.357,0.653,0.376,1.022c0.043,0.835-0.129,2.365-1.634,3.742	c-0.162,0.148-0.059,0.419,0.16,0.428c0.942,0.041,2.843-0.014,4.797-0.877c0.557-0.246,1.191-0.203,1.729,0.083	C20.453,39.764,24.333,40,28,40c4.676,0,9.339-1.04,12.417-2.916C42.038,34.799,43,32.014,43,29V19C43,11.268,36.732,5,29,5z"
                      ></path>
                      <path
                        fill="#2962ff"
                        d="M36.75,27C34.683,27,33,25.317,33,23.25s1.683-3.75,3.75-3.75s3.75,1.683,3.75,3.75	S38.817,27,36.75,27z M36.75,21c-1.24,0-2.25,1.01-2.25,2.25s1.01,2.25,2.25,2.25S39,24.49,39,23.25S37.99,21,36.75,21z"
                      ></path>
                      <path
                        fill="#2962ff"
                        d="M31.5,27h-1c-0.276,0-0.5-0.224-0.5-0.5V18h1.5V27z"
                      ></path>
                      <path
                        fill="#2962ff"
                        d="M27,19.75v0.519c-0.629-0.476-1.403-0.769-2.25-0.769c-2.067,0-3.75,1.683-3.75,3.75	S22.683,27,24.75,27c0.847,0,1.621-0.293,2.25-0.769V26.5c0,0.276,0.224,0.5,0.5,0.5h1v-7.25H27z M24.75,25.5	c-1.24,0-2.25-1.01-2.25-2.25S23.51,21,24.75,21S27,22.01,27,23.25S25.99,25.5,24.75,25.5z"
                      ></path>
                      <path
                        fill="#2962ff"
                        d="M21.25,18h-8v1.5h5.321L13,26h0.026c-0.163,0.211-0.276,0.463-0.276,0.75V27h7.5	c0.276,0,0.5-0.224,0.5-0.5v-1h-5.321L21,19h-0.026c0.163-0.211,0.276-0.463,0.276-0.75V18z"
                      ></path>
                    </svg>
                  </button>
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center">
                  <DialogHeader>
                    <DialogTitle className="text-center">
                      Scan to visit our Zalo Profile!
                    </DialogTitle>
                    <DialogDescription>
                      <Image
                        src="/infozysms-zalo.jpg"
                        alt="Infozy SMS Zalo QR Code"
                        width={300}
                        height={300}
                      />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://account.microsoft.com/?lang=en-GB#main-content-landing-react"
                aria-label="Visit our Skype"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="34"
                  height="34"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#03a9f4"
                    d="M24 4A20 20 0 1 0 24 44A20 20 0 1 0 24 4Z"
                  ></path>
                  <path
                    fill="#03a9f4"
                    d="M33.5 22A11.5 11.5 0 1 0 33.5 45 11.5 11.5 0 1 0 33.5 22zM14.5 3A11.5 11.5 0 1 0 14.5 26 11.5 11.5 0 1 0 14.5 3z"
                  ></path>
                  <path
                    fill="#fff"
                    d="M24.602,36C18,36,15,32.699,15,30.199C15,28.898,15.898,28,17.199,28c2.801,0,2.102,4.102,7.402,4.102c2.699,0,4.199-1.5,4.199-3c0-0.902-0.402-1.902-2.199-2.402l-5.902-1.5C16,24,15.102,21.398,15.102,18.898c0-5.098,4.699-6.898,9.098-6.898C28.301,12,33,14.199,33,17.199c0,1.301-1,2.102-2.301,2.102c-2.398,0-2-3.402-6.801-3.402c-2.398,0-3.797,1.102-3.797,2.703c0,1.598,1.898,2.098,3.598,2.5l4.402,1C32.898,23.199,34,26,34,28.699C33.898,32.898,30.898,36,24.602,36z"
                  ></path>
                </svg>
              </Link>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.wechat.com/"
                aria-label="Visit our WeChat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="34"
                  height="34"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#8BC34A"
                    d="M18,6C9.2,6,2,12,2,19.5c0,4.3,2.3,8,6,10.5l-2,6l6.3-3.9C14,32.7,16,33,18,33c8.8,0,16-6,16-13.5C34,12,26.8,6,18,6z"
                  ></path>
                  <path
                    fill="#7CB342"
                    d="M20,29c0-6.1,5.8-11,13-11c0.3,0,0.6,0,0.9,0c-0.1-0.7-0.3-1.4-0.5-2c-0.1,0-0.3,0-0.4,0c-8.3,0-15,5.8-15,13c0,1.4,0.3,2.7,0.7,4c0.7,0,1.4-0.1,2.1-0.2C20.3,31.6,20,30.3,20,29z"
                  ></path>
                  <path
                    fill="#CFD8DC"
                    d="M46,29c0-6.1-5.8-11-13-11c-7.2,0-13,4.9-13,11s5.8,11,13,11c1.8,0,3.5-0.3,5-0.8l5,2.8l-1.4-4.8C44.3,35.2,46,32.3,46,29z"
                  ></path>
                  <path
                    fill="#33691E"
                    d="M14,15c0,1.1-0.9,2-2,2s-2-0.9-2-2s0.9-2,2-2S14,13.9,14,15z M24,13c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S25.1,13,24,13z"
                  ></path>
                  <path
                    fill="#546E7A"
                    d="M30,26.5c0,0.8-0.7,1.5-1.5,1.5S27,27.3,27,26.5s0.7-1.5,1.5-1.5S30,25.7,30,26.5z M37.5,25c-0.8,0-1.5,0.7-1.5,1.5s0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5S38.3,25,37.5,25z"
                  ></path>
                </svg>
              </Link>
            </div>
          </div>

          {/* Middle - Links */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <Link href="/pricing" className="hover:text-white">
                Pricing
              </Link>
              <Link href="/website-research" className="hover:text-white">
                Website Research
              </Link>
              <Link href="/keyword-research" className="hover:text-white">
                Keyword Research
              </Link>
              <Link href="/ai-content-editor" className="hover:text-white">
                AI Content Editor
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://infozysms.com/blog/"
                className="hover:text-white"
              >
                Blog
              </Link>
              <Link href="/#faq" className="hover:text-white">
                FAQ
              </Link>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://infozysms.com/contact/"
                className="hover:text-white"
              >
                Contact us
              </Link>
            </div>
          </div>

          {/* Right - Company Links */}
          <div className="flex flex-col gap-2">
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://infozysms.com/about/"
              className="hover:text-white"
            >
              About Us
            </Link>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://infozysms.com/privacy-policy/"
              className="hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://infozysms.com/terms-of-use/"
              className="hover:text-white"
            >
              Terms & Conditions
            </Link>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://infozysms.com/refund/"
              className="hover:text-white"
            >
              Refund Policy
            </Link>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="w-full text-sm text-center text-muted-foreground">
          © {new Date().getFullYear()} The name and the logo are registered
          trademarks of{" "}
          <Link
            target="_blank"
            rel="noreferrer noopener"
            href="https://skycomtelecom.eu/"
            className="hover:underline"
          >
            Skycom Telecommunication KFT.
          </Link>
        </div>
      </div>
    </footer>
  );
}
