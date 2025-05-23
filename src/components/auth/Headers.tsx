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
    <div className="flex w-full flex-col items-center justify-center gap-y-4">
      <div className="m-1 flex items-center justify-center">
        <div className="mx-3">
          {/* Ensure the image path is correct */}
          <Image
            src={"/images/logo/zetdc.png"}
            alt="Zetdc"
            width={40}
            height={40}
            className="rounded-full object-contain p-1"
          />
        </div>

        {/* Make the text white */}
        <h1
          className={cn(
            "items-center justify-center text-lg font-semibold text-white",
            font.className,
          )}
        >
          Zetdc Performance Reporting
        </h1>
      </div>

      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};
