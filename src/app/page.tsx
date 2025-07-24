import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
      <div className="min-h-screen overflow-hidden bg-gradient-to-r from-green-200 to-cyan-200 flex flex-col">
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="text-center w-full max-w-4xl mx-auto">
            <h1 className="text-gray-800 text-7xl font-bold mb-6">
              Welcome to BillUp
            </h1>
            <p className="text-gray-700 text-4xl mb-10 leading-relaxed">
              Pay all your bills in one place!<br />
            </p>

            <Link
                href="/login"
                className="block mx-auto w-60 bg-white text-gray-800 font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition mb-6 text-xl"
            >
              Log in
            </Link>

            <p className="text-gray-700 text-lg">
              <Link href="/registration" className="underline hover:text-gray-900">
                Don’t have an account?
              </Link>
            </p>
          </div>
        </div>
      </div>
  );
}
