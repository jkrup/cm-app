import Link from 'next/link'

export default function NavigationBar() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#101830] border-t border-[#2A3A60]">
      <div className="flex justify-around items-center h-16">
        <Link href="/" className="flex flex-col items-center text-[#6ECBDC] hover:text-[#8FE5F5] transition-colors">
          <svg className="w-6 h-6 drop-shadow-[0_0_3px_rgba(110,203,220,0.6)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
          </svg>
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/friends" className="flex flex-col items-center text-[#6ECBDC] hover:text-[#8FE5F5] transition-colors">
          <svg className="w-6 h-6 drop-shadow-[0_0_3px_rgba(110,203,220,0.6)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16,13C15.71,13 15.38,13 15.03,13.05C16.19,13.89 17,15 17,16.5V19H23V16.5C23,14.17 18.33,13 16,13M8,13C5.67,13 1,14.17 1,16.5V19H15V16.5C15,14.17 10.33,13 8,13M8,11A3,3 0 0,0 11,8A3,3 0 0,0 8,5A3,3 0 0,0 5,8A3,3 0 0,0 8,11M16,11A3,3 0 0,0 19,8A3,3 0 0,0 16,5A3,3 0 0,0 13,8A3,3 0 0,0 16,11Z" />
          </svg>
          <span className="text-xs mt-1">Friends</span>
        </Link>
        <Link href="/minigames" className="flex flex-col items-center text-[#6ECBDC] hover:text-[#8FE5F5] transition-colors">
          <svg className="w-6 h-6 drop-shadow-[0_0_3px_rgba(110,203,220,0.6)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21,6H3A2,2 0 0,0 1,8V16A2,2 0 0,0 3,18H21A2,2 0 0,0 23,16V8A2,2 0 0,0 21,6M11,13H8V16H6V13H3V11H6V8H8V11H11M15.5,15A1.5,1.5 0 0,1 14,13.5A1.5,1.5 0 0,1 15.5,12A1.5,1.5 0 0,1 17,13.5A1.5,1.5 0 0,1 15.5,15M19.5,12A1.5,1.5 0 0,1 18,10.5A1.5,1.5 0 0,1 19.5,9A1.5,1.5 0 0,1 21,10.5A1.5,1.5 0 0,1 19.5,12Z" />
          </svg>
          <span className="text-xs mt-1">Games</span>
        </Link>
        <Link href="/shop" className="flex flex-col items-center text-[#6ECBDC] hover:text-[#8FE5F5] transition-colors">
          <svg className="w-6 h-6 drop-shadow-[0_0_3px_rgba(110,203,220,0.6)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z" />
          </svg>
          <span className="text-xs mt-1">Shop</span>
        </Link>
      </div>
    </nav>
  )
}