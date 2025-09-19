"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

const reviews = [
  {
    name: "Rohit Sharma",
    role: "Business Owner, India",
    quote:
      "We’ve been using InfozySMS for over six months to send promotional offers and transaction alerts. The delivery speed is fantastic, and the cost is very affordable compared to others.",
    avatar: "1.png",
  },
  {
    name: "Aisha Al Mansoori",
    role: "Marketing Lead, Dubai",
    quote:
      "The platform is reliable and easy to use. We especially like the AI agent integration—it saves time by handling repetitive customer queries automatically.",
    avatar: "2.png",
  },
  {
    name: "Nguyen Van An",
    role: "Startup Founder, Vietnam",
    quote:
      "As a small business, affordability is important to us. InfozySMS offers great rates without compromising on quality. Bulk messages reach instantly, and the reseller option is a big plus.",
    avatar: "3.png",
  },
  {
    name: "Lim Wei Sheng",
    role: "E-commerce Seller, Singapore",
    quote:
      "Setup was super simple. Within a day we had our promotional campaigns running. The analytics dashboard helps us track conversions effectively.",
    avatar: "4.png",
  },
  {
    name: "Priya Nair",
    role: "Operations Manager, Malaysia",
    quote:
      "We needed a secure platform for sending OTPs and alerts. InfozySMS is reliable and compliant with local regulations, which gave us confidence to switch fully.",
    avatar: "5.png",
  },
  {
    name: "James Thompson",
    role: "Retail Chain Owner, London",
    quote:
      "We used InfozySMS for a holiday sale campaign, and the response was incredible. Scheduling and automation through AI agents made everything seamless.",
    avatar: "6.png",
  },
  {
    name: "Arjun Mehta",
    role: "Digital Marketer, India",
    quote:
      "Earlier, sending bulk SMS was a headache—delivery issues, high costs, no support. With InfozySMS, everything is smooth, and their support team is quick to respond.",
    avatar: "7.png",
  },
  {
    name: "Fatima Hassan",
    role: "Travel Agency Owner, Dubai",
    quote:
      "Our travel agency now uses InfozySMS for SMS reminders and offers. Customers love the instant updates, and it enhances our professional image.",
    avatar: "8.png",
  },
  {
    name: "Tran Thi Mai",
    role: "Boutique Shop Owner, Vietnam",
    quote:
      "I’m not very technical, but InfozySMS is easy to use. Sending festival greetings and discount offers has helped me connect better with my regular customers.",
    avatar: "9.png",
  },
  {
    name: "Oliver Wright",
    role: "Freelancer & Reseller, London",
    quote:
      "I signed up as a reseller with InfozySMS, and it’s turned into a solid side income. I can onboard clients under my brand and offer SMS services seamlessly.",
    avatar: "10.png",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20">
      <div className="mx-auto max-w-7xl px-6 flex flex-col">
        <p className="w-fit text-sm font-medium text-white bg-primary px-4 py-1 rounded-full shadow-md mx-auto md:mx-0">
          Testimonials
        </p>
        <div className="mt-4 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <h2 className="max-w-xl max-md:text-center text-3xl font-semibold md:text-4xl">
            What Our Awesome Customers Say
          </h2>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          className="mt-10"
        >
          <CarouselContent>
            {reviews.map((t) => (
              <CarouselItem key={t.name} className="md:basis-1/2 lg:basis-1/3">
                <div className="h-full">
                  <Card className="rounded-2xl bg-neutral-50 shadow-sm h-full">
                    <CardContent className="px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-white">
                          <Image
                            src={`/home/testimonials/${t.avatar}`}
                            alt={`${t.name} avatar`}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{t.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {t.role}
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed">{t.quote}</p>
                      <div className="mt-4 text-yellow-500" aria-label="rating">
                        {"★★★★★"}
                        <span className="sr-only">5 stars</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Buttons container - responsive placement */}
          <div className="hidden md:flex justify-center mt-6 gap-2 md:justify-end">
            <CarouselPrevious className="rounded-full shadow" />
            <CarouselNext className="rounded-full shadow" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
