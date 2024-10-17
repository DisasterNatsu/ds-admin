"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Toaster, toast } from "sonner";
import Cookies from "js-cookie";
import { FaCheckCircle } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Axios } from "@/lib/AxiosConfig";

const formSchema = z.object({
  comicTitle: z.string().min(2, {
    message: "Comic Title must be at least 2 characters.",
  }),
  desc: z.string().min(5, {
    message: "Desc must be at least 5 characters.",
  }),
  origin: z.string().min(2, {
    message: "Origin must be at least 2 characters.",
  }),
  status: z.string().min(4, {
    message: "Status must be at least 4 characters.",
  }),
  author: z.string().min(2, {
    message: "Author must be at least 2 characters.",
  }),
  artist: z.string().min(2, {
    message: "Author must be at least 2 characters.",
  }),
});

const NewComic = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const [genreInput, setGenreInput] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const { resolvedTheme } = useTheme();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comicTitle: "",
      desc: "",
      origin: "",
      status: "",
      author: "",
      artist: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Start The loading Toast

    const loadingToastId = toast.warning("Loading...", {
      icon: <div className="spinner" />, // Custom spinner or loading indicator
      duration: Infinity, // Keep it visible until dismissed
    });

    // Data Validation

    if (genres.length === 0) {
      toast.dismiss(loadingToastId); // Dismiss the loading toast
      return toast.error("Please select Genres!");
    } else if (!coverImage) {
      toast.dismiss(loadingToastId); // Dismiss the loading toast
      return toast.error("Please select a Cover Image!");
    }

    // Try Catch Block

    try {
      // Get Token

      const token = Cookies.get("ds-admin-auth");

      if (!token) {
        toast.dismiss(loadingToastId); // Dismiss the loading toast
        return toast.error("Please Log In again!");
      }

      // Create a formdata

      const formData = new FormData();

      formData.append("coverImage", coverImage);
      formData.append("comicTitle", data.comicTitle);
      formData.append("desc", data.desc);
      formData.append("origin", data.origin);
      formData.append("status", data.status);
      formData.append("genres", JSON.stringify(genres));
      formData.append("author", data.author);
      formData.append("artist", data.artist);

      const uploadRequest = await Axios.post("/post-comic/add-new", formData, {
        headers: {
          "ds-admin-token": token,
        },
      });

      const response = await uploadRequest.data;

      toast.dismiss(loadingToastId); // Dismiss the loading toast

      toast.success(response.message, {
        icon: <FaCheckCircle size={15} />, // Custom spinner or loading indicator
      });

      setTimeout(() => {
        router.push(response.link);
      }, 2000);
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

  const handleGenreKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && genreInput.trim()) {
      e.preventDefault(); // Prevent the default form submission
      setGenres((prev) => [...prev, genreInput.trim()]);
      setGenreInput(""); // Clear the input field
    }
  };

  const removeGenre = (genreToRemove: string) => {
    setGenres((prev) => prev.filter((genre) => genre !== genreToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverImage(e.target.files[0]);
    }
  };

  return (
    <div className="p-4 pt-10">
      <Toaster
        closeButton
        richColors
        expand={false}
        theme={resolvedTheme === "dark" ? "dark" : "light"} // Dynamically set theme based on the current Tailwind theme
        visibleToasts={1}
      />
      <div className="flex w-full flex-col justify-center items-center">
        <h1>Upload New Comic</h1>

        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2 w-[600px]"
            >
              <FormField
                control={form.control}
                name="comicTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comic Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Martial Peak" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. Martial Peak"
                        rows={5}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origin</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. India" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                        <SelectItem value="Dropped">Dropped</SelectItem>
                        <SelectItem value="Stopped">Stopped</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between gap-2">
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. India" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="artist"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Artist</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Pikapi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Label className="mt-5 -mb-5">Genres</Label>
              <div className="flex flex-wrap mb-2">
                {genres.map((genre, index) => (
                  <span
                    key={index}
                    className="flex items-center mr-2 mb-2 dark:bg-slate-800 text-xs rounded-full px-2 py-1"
                  >
                    {genre}
                    <button
                      type="button"
                      className="ml-2 text-red-500"
                      onClick={() => removeGenre(genre)}
                    >
                      &times; {/* Cross icon */}
                    </button>
                  </span>
                ))}
              </div>
              <Input
                placeholder="e.g. Action"
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
                onKeyDown={handleGenreKeyDown}
              />

              <Label className="mt-5 -mb-5">Cover Image</Label>
              <Input type="file" accept="image/*" onChange={handleFileChange} />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default NewComic;
