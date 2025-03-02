"use client";

import { Button, Spinner, Tab, Tabs } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import FoldableHorizontalAdsense from "@/app/(main)/_components/FoldableHorizontalAdsense";
import VerticalAdSense from "@/app/(main)/_components/VerticalAdSense";
import SearchBar from "@/components/common/search-bar";
import { AddCircleIcon } from "@/components/icons";
import useDebounce from "@/hooks/use-debounce/use-debounce";
import { main } from "@/styles/primitives";
import { Filter } from "@/types/Filter";
import { GameListItemResponseDto } from "@/types/dto/game/response";
import { checkCookieByCSR } from "@/utils/cookieChecker";
import GameGrid from "./_components/game-grid";

export type FetchStatus = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [filter, setFilter] = useState<Filter>(Filter.POPULARITY);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(20);
  const [games, setGames] = useState<GameListItemResponseDto[]>([]);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("idle");
  const [totalPage, setTotalPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const [debouncedValue] = useDebounce(searchInput, 300);
  const pageRef = useRef(page);
  const loadMoreRef = useRef<HTMLDivElement | null>(null); // Sentinel 요소

  // 게임 목록 로드 함수
  const loadGames = useCallback(async () => {
    try {
      setFetchStatus("loading");

      let filterParam = "recommended";
      switch (filter) {
        case Filter.POPULARITY:
          filterParam = "popularity";
          break;
        case Filter.LATEST:
          filterParam = "latest";
          break;
      }

      const url = `/api/game?size=${size}&page=${page}&filter=${filterParam}&keyword=${debouncedValue}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        console.error("Failed to fetch game list");
        setFetchStatus("error");
        return;
      }
      const data = await res.json();
      setTotalPage(data.totalPage || 1);

      console.log("loadGames()");

      setGames((prev) => {
        const combined = [...prev, ...data.games];
        const uniqueGames = Array.from(
          new Map(combined.map((game) => [game.gameId, game])).values(),
        );
        return uniqueGames;
      });

      setFetchStatus("success");
    } catch (e) {
      console.error(e);
      setFetchStatus("error");
    }
  }, [debouncedValue, filter, page, size]);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  // URL 파라미터와 검색어 동기화
  useEffect(() => {
    const kw = searchParams.get("keyword") ?? "";
    if (kw !== searchInput) {
      setSearchInput(kw);
    }
  }, [searchParams]);

  // 디바운스된 검색어로 URL 업데이트
  useEffect(() => {
    if (debouncedValue.trim() !== "") {
      router.push(`/?keyword=${encodeURIComponent(debouncedValue)}`);
    } else {
      router.push("/");
    }
  }, [debouncedValue, router]);

  // 필터, 페이지, 사이즈, 검색어 변경 시 게임 목록 재요청
  useEffect(() => {
    loadGames();
  }, [loadGames]);

  // 필터나 검색어 변경 시 페이지 초기화
  useEffect(() => {
    setPage(1);
    setGames([]);
    setTotalPage(1);
  }, [filter, debouncedValue]);

  // IntersectionObserver를 이용한 무한 스크롤 처리
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          fetchStatus !== "loading" &&
          pageRef.current < totalPage
        ) {
          setPage(pageRef.current + 1);
        }
      },
      { rootMargin: "100px" },
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchStatus, totalPage]);

  return (
    <main
      className={`${main({
        padding: "sm",
        display: "flex",
        flexDirection: "col",
      })} min-h-screen`}
      style={{ paddingBottom: "280px" }} // 하단 광고와 겹치지 않도록 충분한 여백
    >
      {/* 상단 섹션 (검색바, 탭, 버튼 등) */}
      <section className="mb-4 flex flex-col items-start justify-start gap-4 md:px-4">
        <SearchBar input={searchInput} onValueChange={setSearchInput} />
        <section className="flex w-full items-center justify-between">
          <Tabs
            aria-label="Tabs sizes"
            size="md"
            selectedKey={filter}
            onSelectionChange={(key) => setFilter(key as Filter)}
          >
            <Tab key={Filter.POPULARITY} title="Popularity" />
            <Tab key={Filter.RECOMMENDED} title="Recommended" />
            <Tab key={Filter.LATEST} title="Latest" />
          </Tabs>
          {checkCookieByCSR("accessToken") === true && (
            <Button
              color="primary"
              startContent={<AddCircleIcon />}
              onPress={() => router.push("/game/create")}
            >
              Create Game
            </Button>
          )}
        </section>
      </section>

      {/* 게임 목록 및 광고 영역 */}
      <section className="relative w-full">
        {/* 왼쪽 광고 (md 이상) */}
        <div className="sticky top-20 hidden md:block">
          <VerticalAdSense position="left" />
        </div>

        {/* 오른쪽 광고 (md 이상) */}
        <div className="sticky hidden md:block">
          <VerticalAdSense position="right" />
        </div>

        {/* 게임 목록 */}
        <div className="col-span-full w-full lg:col-auto 2xl:pl-[50px] 2xl:pr-[50px]">
          <GameGrid games={games} fetchStatus={fetchStatus} page={page} />
        </div>

        {/* Sentinel 요소 */}
        <div ref={loadMoreRef} className="h-10"></div>
      </section>

      {/* 무한 스크롤 로딩 표시 */}
      {fetchStatus === "loading" && page > 1 && (
        <div className="flex min-h-[300px] justify-center py-4">
          <Spinner color="primary" label="Loading..." labelColor="foreground" />
        </div>
      )}

      {/* 하단 고정 Foldable Horizontal Adsense */}
      <FoldableHorizontalAdsense />
    </main>
  );
}
