"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Axios } from "@/lib/AxiosConfig";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid Email!" }),
  password: z
    .string()
    .min(5, { message: "Password must be 5 characters long!" }),
});

const Home = () => {
  const { resolvedTheme } = useTheme();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Display a loading toast
    const loadingToastId = toast.warning("Loading...", {
      icon: <div className="spinner" />, // Custom spinner or loading indicator
      duration: Infinity, // Keep it visible until dismissed
    });

    try {
      const req = await Axios.post("/admin/sign-in", data);

      const res = (await req.data) as SignInResponse;

      toast.dismiss(loadingToastId); // Dismiss the loading toast

      toast.success("Success! Welcome back!", {
        icon: <FaCheckCircle size={15} />, // Custom spinner or loading indicator
      });

      setTimeout(() => {
        router.replace("/dashboard");
      }, 2000);

      return;
    } catch (error: any) {
      console.log(error);

      toast.dismiss(loadingToastId); // Dismiss the loading toast

      return toast.error(error.response.data.message);
    }

    console.log(data);
  };

  return (
    <>
      <title>Log In - Admin DS</title>
      <main className="dark:bg-neutral-800 bg-slate-400 flex w-screen h-screen">
        <Toaster
          closeButton
          richColors
          expand={false}
          theme={resolvedTheme === "dark" ? "dark" : "light"} // Dynamically set theme based on the current Tailwind theme
          visibleToasts={1}
        />
        <div className="flex-1 flex container items-center justify-center mx-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 w-96 p-4 rounded-md dark:bg-neutral-950 bg-slate-500"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black dark:text-white">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. example@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black dark:text-white">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full dark:bg-slate-400 dark:text-black bg-neutral-950 text-white font-semibold"
              >
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </>
  );
};

export default Home;
