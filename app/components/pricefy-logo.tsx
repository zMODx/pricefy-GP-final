import Image from "next/image"

export default function PricefyLogo() {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/pricefy-logo.png"
        alt="Pricefy Logo"
        width={320}
        height={80}
        className="h-auto max-w-full"
        priority
      />
    </div>
  )
}
