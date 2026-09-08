import { useEffect, useRef, useState, useCallback } from "react";

const baseURL = import.meta.env.VITE_server_url || "https://server-six-vert.vercel.app";

/**
 * Streams GET /questions?stream=1 as NDJSON: {type:'meta',total,...} + {type:'question',...}
 * Falls back to JSON if server returns single JSON object.
 * Abortable via AbortController on filter change.
 */
export function useStreamedQuestions({ q, category, tag, destinationCountry, homeCountry, studyLevel, sort }) {
  const [pages, setPages] = useState([]); // [{data,total,page,totalPages}]
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [isError, setIsError] = useState(false);
  const abortRef = useRef(null);
  const pageRef = useRef(1);
  const totalRef = useRef(0);
  const totalPagesRef = useRef(1);

  const key = JSON.stringify({ q, category, tag, destinationCountry, homeCountry, studyLevel, sort });

  const fetchPage = useCallback(async (pageNum, isFirst) => {
    // abort previous if isFirst (filter change)
    if (isFirst && abortRef.current) {
      try { abortRef.current.abort(); } catch {}
    }
    const controller = new AbortController();
    abortRef.current = controller;
    if (isFirst) {
      setIsLoading(true);
      setIsError(false);
      setPages([]);
      pageRef.current = 1;
    } else {
      setIsFetchingNextPage(true);
    }
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (category) params.set("category", category);
      if (tag) params.set("tag", tag);
      if (destinationCountry) params.set("destinationCountry", destinationCountry);
      if (homeCountry) params.set("homeCountry", homeCountry);
      if (studyLevel) params.set("studyLevel", studyLevel);
      if (sort) params.set("sort", sort);
      params.set("page", String(pageNum));
      params.set("limit", "12");
      params.set("stream", "1");

      const res = await fetch(`${baseURL}/questions?${params.toString()}`, {
        signal: controller.signal,
        headers: { Accept: "application/x-ndjson" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const ct = res.headers.get("Content-Type") || "";
      // fallback: if server returned JSON not NDJSON
      if (ct.includes("application/json") && !ct.includes("ndjson")) {
        const json = await res.json();
        const pageData = json.data || [];
        totalRef.current = json.total ?? pageData.length;
        totalPagesRef.current = json.totalPages ?? 1;
        const pageObj = { data: pageData, total: totalRef.current, page: json.page ?? pageNum, totalPages: totalPagesRef.current };
        setPages(prev => isFirst ? [pageObj] : [...prev, pageObj]);
        return;
      }
      // NDJSON streaming
      const reader = res.body?.getReader();
      if (!reader) {
        // no body stream — fallback to json
        const json = await res.json();
        const pageData = json.data || [];
        totalRef.current = json.total ?? pageData.length;
        totalPagesRef.current = json.totalPages ?? 1;
        setPages(prev => isFirst ? [{ data: pageData, total: totalRef.current, page: pageNum, totalPages: totalPagesRef.current }] : [...prev, { data: pageData, total: totalRef.current, page: pageNum, totalPages: totalPagesRef.current }]);
        return;
      }
      const decoder = new TextDecoder();
      let buffer = "";
      let meta = null;
      let data = [];
      const flushBuffer = () => {
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const obj = JSON.parse(line);
            if (obj.type === "meta") {
              meta = obj;
              totalRef.current = obj.total ?? 0;
              totalPagesRef.current = obj.totalPages ?? 1;
            } else if (obj.type === "question") {
              const doc = { ...obj }; delete doc.type;
              data.push(doc);
              // incremental render: update pages with current data so far for this page
              const pageObj = { data: [...data], total: totalRef.current, page: pageNum, totalPages: totalPagesRef.current };
              setPages(prev => {
                if (isFirst) {
                  // replace first page with incremental data
                  return [pageObj, ...prev.slice(1)];
                } else {
                  // replace last page incrementally
                  const copy = [...prev];
                  // ensure last page is this page
                  if (copy.length === 0 || copy[copy.length - 1].page !== pageNum) copy.push(pageObj);
                  else copy[copy.length - 1] = pageObj;
                  return copy;
                }
              });
            } else if (obj.type === "error") {
              setIsError(true);
            }
          } catch {}
        }
      };
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        flushBuffer();
      }
      // flush remaining
      if (buffer.trim()) {
        try {
          const obj = JSON.parse(buffer.trim());
          if (obj.type === "meta") { totalRef.current = obj.total; totalPagesRef.current = obj.totalPages; }
          else if (obj.type === "question") { const doc = { ...obj }; delete doc.type; data.push(doc); }
        } catch {}
      }
      // ensure final page object correct (in case data was empty or only meta)
      if (meta || data.length) {
        const pageObj = { data, total: totalRef.current, page: pageNum, totalPages: totalPagesRef.current };
        setPages(prev => {
          if (isFirst) return prev.length && prev[0].page === pageNum ? [pageObj, ...prev.slice(1)] : [pageObj, ...prev.slice(1)];
          // find and replace last page
          const copy = [...prev];
          const idx = copy.findIndex(p => p.page === pageNum);
          if (idx >= 0) copy[idx] = pageObj;
          else copy.push(pageObj);
          return copy;
        });
      }
    } catch (e) {
      if (e.name === "AbortError") return;
      setIsError(true);
    } finally {
      setIsLoading(false);
      setIsFetchingNextPage(false);
    }
  }, [q, category, tag, destinationCountry, homeCountry, studyLevel, sort]);

  // fetch first page when key changes
  useEffect(() => {
    fetchPage(1, true);
    return () => { try { abortRef.current?.abort(); } catch {} };
  }, [key, fetchPage]);

  const hasNextPage = (() => {
    if (!pages.length) return false;
    const last = pages[pages.length - 1];
    const cur = last?.page ?? 1;
    const tp = last?.totalPages ?? totalPagesRef.current ?? 1;
    return cur < tp;
  })();

  const fetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      const next = (pages[pages.length - 1]?.page ?? 1) + 1;
      fetchPage(next, false);
    }
  }, [hasNextPage, isFetchingNextPage, pages, fetchPage]);

  return { data: { pages }, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, isError };
}
