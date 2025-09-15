import { content } from "@/db";
import Image from "next/image";
import Link from "next/link";

/**
 * Footer
 */
export default async function Footer() {
  return (
    <footer className={"bg-black text-white border-t border-t-white/10"}>
      <div className={"container"}>
        <nav
          className={"grid grid-cols-4 max-md:grid-cols-2 gap-8 py-10 md:py-16"}
        >
          {content.footer.columns.map((column, index) => (
            <div key={index} className={"flex flex-col gap-2 flex-1"}>
              <p className={"font-extrabold italic leading-[130%] text-sm"}>
                {column.label}
              </p>
              <ul className={"flex flex-col gap-1.5"}>
                {column.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      className={
                        "text-white/60 hover:text-white relative group transition-colors duration-200 pb-1 text-sm"
                      }
                      href={link.href}
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div
          className={
            "flex items-center justify-between border-t border-white/10 py-10"
          }
        >
          <div
            className={
              "font-extrabold leading-[130%] text-sm italic max-md:hidden"
            }
          >
            © {new Date().getFullYear()} KOMBA
          </div>
          <Link href={"/"} className={"relative mx-auto"}>
            <Image
              src={"/logo.png"}
              alt={"Komba logo"}
              width={208}
              height={32}
            />
          </Link>
          <div className={"flex items-center gap-3 max-md:hidden"}>
            <div className={"relative w-5 h-5"}>
              <Image src={"/globe.svg"} alt={"Globe icon"} fill />
            </div>
            <select
              className={
                "font-body font-extrabold text-sm leading-[130%] italic pr-2 uppercase"
              }
            >
              <option className={"text-black normal-case not-italic"}>
                English
              </option>
              <option className={"text-black normal-case not-italic"}>
                Dansk
              </option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}
