import React from "react";
import { Axios } from "@/lib/AxiosConfig";
import { FaRegEdit } from "react-icons/fa";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

const getComics = async () => {
  const req = await Axios.get("/get-comics/all");

  const allComics = await req.data;

  return { allComics };
};

const Comics = async () => {
  const { allComics }: { allComics: AllComicsResType[] } = await getComics();

  return (
    <div className="p-4 pt-16">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Genres</TableHead>
            <TableHead className="text-right">Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allComics.map((comic: AllComicsResType, index: number) => {
            const genres = JSON.parse(comic.Genres).join(", ");
            const link =
              "/comics/" +
              comic.id +
              "-" +
              comic.ComicTitle.split(" ").join("-").toLowerCase();

            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{comic.id}</TableCell>
                <TableCell className="font-medium">
                  {comic.ComicTitle}
                </TableCell>
                <TableCell>
                  {comic.Status === "Ongoing" ? (
                    <span className="bg-[#E1F0DA] dark:bg-[#212d1c] text-[#99BC85] text-[10px] font-bold text-foreground-100 px-2 py-1 rounded uppercase">
                      {comic.Status}
                    </span>
                  ) : (
                    <span className="bg-[#FFC5C5] dark:bg-[#5b2e30] text-[#ff8080] text-[10px] font-bold text-foreground-100 px-2 py-1 rounded uppercase">
                      {comic.Status}
                    </span>
                  )}
                </TableCell>
                <TableCell>{genres}</TableCell>
                <TableCell className="text-right w-4">
                  <Link href={link}>
                    <FaRegEdit />
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default Comics;
