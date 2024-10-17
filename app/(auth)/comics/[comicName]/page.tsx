import React from "react";
import { Axios } from "@/lib/AxiosConfig";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ChapterUpload from "@/components/chapter/ChapterUpload";

const getChaptersData = async (slug: string) => {
  const req = await Axios.get(`/get-chapters/all/${slug}`);

  const chapters = await req.data;

  return { chapters };
};

const ComicName = async ({ params }: { params: { comicName: string } }) => {
  const { chapters }: { chapters: ChapterResponse } = await getChaptersData(
    params.comicName
  );

  const title = chapters.comicDetails.ComicTitle;

  return (
    <>
      <title>{`${title} - DS`}</title>
      <div className="pt-14 p-4">
        <div>
          <h1>{title}</h1>
          <p className="text-sm">{chapters.comicDetails.Description}</p>
        </div>

        <div className="my-2 flex items-center justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="font-semibold">Add New Chapter</Button>
            </DialogTrigger>
            <ChapterUpload
              comicTitle={title}
              comicID={chapters.comicDetails.id}
            />
          </Dialog>
        </div>

        <div className="py-2 border-2 rounded-md mt-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Chapter Number</TableHead>
                <TableHead>Chapter Name</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chapters.chapters.map((chapter, index: number) => {
                const date = new Date(chapter.chapterDate);
                const formattedDate = `${String(date.getDate()).padStart(
                  2,
                  "0"
                )}-${String(date.getMonth() + 1).padStart(
                  2,
                  "0"
                )}-${date.getFullYear()}`;
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {chapter.chapterID}
                    </TableCell>
                    <TableCell>{chapter.ChapterNumber}</TableCell>
                    <TableCell>
                      {chapter.ChapterName ? chapter.ChapterName : ""}
                    </TableCell>
                    <TableCell className="text-right">
                      {formattedDate}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default ComicName;
