'use client'
import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import messages from "@/messages.json"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const Home = () => {
  return (
    <>
      <main className='grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
        <section className='text-center mb-8 md:mb-12'>
          <h1 className='text-3xl md:text-5xl font-bold'>
            Dive into the World of Anonymous Conversations
          </h1>
          <p className='mt-3 md:mt-4 text-base md:text-lg'>
            Explore Mystry Message - Where your identity remains a secret.
          </p>
        </section>

        <Carousel
          plugins={[Autoplay({ delay: 3000 })]}
          opts={{ loop: true }}
          className="w-full max-w-md"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-2">
                  <Card className="overflow-hidden rounded-2xl bg-card">
                    <CardHeader className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold">
                          {message.title}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {message.received}
                        </p>
                      </div>
                    </CardHeader>

                    <CardContent className="px-6 pb-8 pt-2">
                      <p className="text-center text-xl font-medium leading-relaxed">
                        {message.content}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <Button className='mt-5'>
          <Link href={'/u/asif'}>
          Send Anonymous Message to Admin
          </Link>
        </Button>
      </main>

      <footer className="text-center p-4 md:p-6">
        © 2026 Mystry Message. All Rights Reserved.
      </footer>
    </>
  )
}

export default Home