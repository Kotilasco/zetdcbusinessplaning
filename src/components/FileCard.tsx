//@ts-nocheck
import Link from "next/link";
import Thumbnail from "@/components/Thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormattedDateTime from "@/components/FormattedDateTime";
import ActionDropdown from "@/components/ActionDropdown";
import ActionD from "./ActionD";

const FileCard = ({ file }: { file }) => {
  return (
    <Link
      href={`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/${
        file.url
      }`}
      target="_blank"
      className="file-card"
    >
      <div className="flex justify-between">
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={file.url}
          className="!size-20"
          imageClassName="!size-11"
        />

        <div className="flex flex-col items-end justify-between">
          {/*   <ActionDropdown file={file} /> */}
          <ActionD file={file} />
          <p className="body-1">{convertFileSize(file.size)}</p>
        </div>
      </div>

      <div className="file-card-details">
        <p className="subtitle-2 line-clamp-1">{file.name}</p>
        <FormattedDateTime
          date={file.createdAt}
          className="body-2 text-light-100"
        />
        <p className="caption line-clamp-1 text-light-200">By: {"Zetdc"}</p>
      </div>
    </Link>
  );
};
export default FileCard;
