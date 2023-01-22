import { ConnectButton } from "@web3uikit/web3";
import Link from "next/link";

export default function Header() {
  return (
    <nav>
      <div className="border-b-2 flex flex-row">
        <div className="flex items-center">
          <h1 className="py-4 px-4 text-3xl">
            food<span className="text-red-600">Trusty</span>
          </h1>
        </div>
        <div className="ml-auto py-2 px-4"></div>
        <li className="mr-4 p-6">
          <Link href="/">Home</Link>
        </li>
        <li className="mr-4 p-6">
          <Link href="/register">Add Product</Link>
        </li>
        <div className="py-4 px-4">
          <ConnectButton moralisAuth={false} />
        </div>
      </div>
    </nav>
  );
}
