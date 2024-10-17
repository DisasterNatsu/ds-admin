"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Cookies from "js-cookie";

import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Toaster, toast } from "sonner";
import { useTheme } from "next-themes";
import { Axios } from "@/lib/AxiosConfig";

// Define the schema for the form
const formSchema = z.object({
  chapterNumber: z.string(),
  chapterName: z.string().min(2, {
    message: "Chapter name must be at least 2 characters.",
  }),
  chapterZip: z.any(),
});

const ChapterUpload = ({
  comicTitle,
  comicID,
}: {
  comicTitle: string;
  comicID: string;
}) => {
  const { resolvedTheme } = useTheme();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chapterNumber: undefined,
      chapterName: "",
    },
  });

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState<string | null>(null);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Display a loading toast
    const loadingToastId = toast.warning("Loading...", {
      icon: <div className="spinner" />, // Custom spinner or loading indicator
      duration: Infinity, // Keep it visible until dismissed
    });

    const formData = new FormData();

    formData.append("chapterNumber", values.chapterNumber);
    formData.append("chapterName", values.chapterName);
    formData.append("comicTitle", comicTitle);
    formData.append("comicID", comicID);

    if (!file) {
      toast.error("No File Selected!");
      toast.dismiss(loadingToastId); // Dismiss the loading toast
      return;
    }

    formData.append("pages", file);

    try {
      const token = Cookies.get("ds-admin-auth");

      if (!token) toast.error("Please Re.Log In");

      const req = await Axios.post("/post-chapters/add-new", formData, {
        headers: {
          "ds-admin-token": token,
        },
      });

      const res = await req.data;

      console.log(res);

      setLink(res.link);
      toast.dismiss(loadingToastId); // Dismiss the loading toast

      toast.success(res.message);

      // console.log("Form data prepared for submission:", formData);
    } catch (error) {
      // Use a more specific error type
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      console.log(error);

      toast.dismiss(loadingToastId); // Dismiss the loading toast
      return toast.error(errorMessage);
    }
  };

  return (
    <>
      <Toaster
        closeButton
        richColors
        expand={false}
        theme={resolvedTheme === "dark" ? "dark" : "light"} // Dynamically set theme based on the current Tailwind theme
        visibleToasts={1}
      />
      <DialogContent className="sm:max-w-[425px] md:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add New Chapter</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="chapterNumber" className="text-right">
                  Chapter Number
                </Label>
                <Input
                  id="chapterNumber"
                  type="text"
                  className="col-span-3"
                  placeholder="e.g. 123"
                  {...form.register("chapterNumber")}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="chapterName" className="text-right">
                  Chapter Name
                </Label>
                <Input
                  id="chapterName"
                  placeholder="e.g. Greed Kills The Cat"
                  className="col-span-3"
                  {...form.register("chapterName")}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="chapterZip" className="text-right">
                  Chapter Zip
                </Label>
                <Input
                  id="chapterZip"
                  type="file"
                  className="col-span-3"
                  accept=".zip,.rar,.tar,.gz,.7z"
                  onChange={(e) => {
                    if (e.target.files) {
                      const selectedFile = e.target.files[0];
                      if (selectedFile) {
                        const acceptedTypes = [
                          "application/zip",
                          "application/x-rar-compressed",
                          "application/gzip",
                          "application/x-7z-compressed",
                          "application/x-zip-compressed",
                        ];
                        if (!acceptedTypes.includes(selectedFile.type)) {
                          console.error("File type not supported");
                          // Optionally, you can set an error state here
                        } else {
                          setFile(selectedFile);
                          form.setValue("chapterZip", selectedFile);
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <div className="space-x-3">
                <code className="text-xs">{link && link}</code>
                <Button type="submit">Submit</Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </>
  );
};

export default ChapterUpload;
