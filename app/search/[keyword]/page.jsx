"use client";
import AnimeList from "@/app/component/AnimeList";
import Pagination from "@/app/component/Utilities/paginations";
import Loading from "@/app/loading";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = ({ params }) => {
  const searcParams = useSearchParams();

  const search = searcParams.get("page") || 1;
  const [page, setPage] = useState(search);
  const [searchAnime, setSearchAnime] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const endpoint = `${params.keyword}?page=`;

  const fetchData = async () => {
    setIsLoading(true); // Set status loading menjadi true saat fetch dimulai
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/anime?q=${params.keyword}&sfw&page=${page}`
      );
      const data = await response.json();
      setSearchAnime(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // Set status loading menjadi false setelah fetch selesai
    }
  };
  
    
  

  useEffect(() => {
    fetchData();
  }, [page]);

  const maxAnime = 25;

  return (
    <div>
      {isLoading ? ( // Tampilkan loading jika isLoading true
        <Loading />
      ) : (
        <div className="pt-[70px] ">
          <h1 className="ml-11 font-bold">
            Pencarian Untuk {decodeURI(params.keyword)}
          </h1>

          {searchAnime.data?.length === 0 ? (
            <p className="ml-3 font-bold">Tidak Ditemukan</p>
          ) : (
            <div>
              <div className="grid md:grid-cols-2 grid-cols-1 md:gap-6 lg:gap-10 lg:px-10 md:px-7 gap-7">
                {searchAnime.data?.map((data, i) => (
                  <div key={`${data.mal_id}-${i}`}>
                    <AnimeList
                      id={data.mal_id}
                      title={data.title}
                      img={data.images.webp.image_url}
                      order={maxAnime * (page - 1) + i}
                      synopsis={data.synopsis}
                      genre={data.genres}
                      score={data.score}
                      type={data.type}
                      episodes={data.episodes}
                      duration={data.duration}
                      airing={data.airing}
                    />
                  </div>
                ))}
              </div>
              <Pagination
                api={searchAnime}
                setPage={setPage}
                page={page}
                endpoint={endpoint}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
