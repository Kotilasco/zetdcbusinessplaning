//@ts-nocheck

'use client'

import React, {
    useState,
    useEffect,
    useTransition,
    useMemo,
    useCallback,
  } from "react";
  import { UserRoles } from "@/next-auth.d";
import { useCurrentUser } from "@/hooks/use-current-user";
import FileCard from "@/components/FileCard";
import { getFiles } from "@/lib/actions/file.actions";
import FileUploader from "@/components/FileUploader";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useDebounce } from "use-debounce";


function page() {

    const user = useCurrentUser();
    const session = useSession();
    const [files, setFiles] = useState(null);
    const [loading, setIsLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const reval = useSelector((state) => state.revalidating.value, shallowEqual);

    const router = useRouter();

    const handleFileUploadSuccess = () => {
        router.refresh();
        setReload(!reload);
      };

      const [debouncedReval] = useDebounce(reval, 500);

      useEffect(() => {
        // Run the effect here
        console.log(debouncedReval);
        const getfiles = async () => {
          const data = await getFiles('1');
          console.log(data);
          setFiles(data.documents || []);
        };
        getfiles();
      }, [ debouncedReval, reload]);
  return (
    <div>
      <div className="w-full my-4 p-3">
            <h1 className="font-normal text-xs">
              Upload all documents associated with the file
            </h1>
            <FileUploader
              ownerId={'ddd'}
              accountId={'1'}
              className="w-full"
              onSuccess={handleFileUploadSuccess}
            />

            {files && files.length > 0 ? (
              <section className="file-list mt-2">
                {files.map((file: File, i: number) => (
                  <FileCard key={i} file={file} />
                ))}
              </section>
            ) : (
              <p className="empty-list">No files uploaded</p>
            )}
          </div>
    </div>
  )
}

export default page
