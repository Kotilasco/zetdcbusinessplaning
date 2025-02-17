import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: "600",
});

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <div className="flex items-center justify-center m-1 ">
        <div className=" mx-3">
          <Image
            src={"/images/logo/zetdc.png"}
            alt="CSMS"
            width={40}
            height={40}
            className="rounded-full object-contain z-100 p-5"
          />
        </div>

        <h1
          className={cn(
            "text-lg font-semibold justify-center items-center",
            font.className
          )}
        >
          ZETDC BUSINESS PLANNING
        </h1>
      </div>

      <p className=" text-muted-foreground text-sm">{label}</p>
    </div>
  );
};
