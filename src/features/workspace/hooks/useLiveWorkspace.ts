"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useConvex, useMutation, useQuery } from "convex/react";
import { backfillWrittenTopicCalendarDatesMutation } from "@/server/convex/references/backfillWrittenTopicCalendarDatesMutation";
import { castBlogId } from "@/server/convex/castBlogId";
import { castProductId } from "@/server/convex/castProductId";
import { createScheduledTopicMutation } from "@/server/convex/references/createScheduledTopicMutation";
import { createScheduledTopicBatchMutation } from "@/server/convex/references/createScheduledTopicBatchMutation";
import { createTopicMutation } from "@/server/convex/references/createTopicMutation";
import { deleteBlogMutation } from "@/server/convex/references/deleteBlogMutation";
import { deleteTopicMutation } from "@/server/convex/references/deleteTopicMutation";
import { ensureWorkspaceReadModelsMutation } from "@/server/convex/references/ensureWorkspaceReadModelsMutation";
import { getBlogQuery } from "@/server/convex/references/getBlogQuery";
import { getCurrentProductProfileQuery } from "@/server/convex/references/getCurrentProductProfileQuery";
import { getCurrentProductQuery } from "@/server/convex/references/getCurrentProductQuery";
import { getWorkspaceSummaryQuery } from "@/server/convex/references/getWorkspaceSummaryQuery";
import { listBlogTopicKeywordsQuery } from "@/server/convex/references/listBlogTopicKeywordsQuery";
import { listBlogsQuery } from "@/server/convex/references/listBlogsQuery";
import { listScheduledTopicsQuery } from "@/server/convex/references/listScheduledTopicsQuery";
import { listTopicKeywordsQuery } from "@/server/convex/references/listTopicKeywordsQuery";
import { listTopicsQuery } from "@/server/convex/references/listTopicsQuery";
import { saveProductScanMutation } from "@/server/convex/references/saveProductScanMutation";
import { updateBlogPublishingIntegrationMutation } from "@/server/convex/references/updateBlogPublishingIntegrationMutation";
import { updateProductSiteLinksMutation } from "@/server/convex/references/updateProductSiteLinksMutation";
import { updateProductDetailsMutation } from "@/server/convex/references/updateProductDetailsMutation";
import { updateTopicNotesMutation } from "@/server/convex/references/updateTopicNotesMutation";
import { updateTopicScheduledDateMutation } from "@/server/convex/references/updateTopicScheduledDateMutation";
import { updateTopicStatusMutation } from "@/server/convex/references/updateTopicStatusMutation";
import { updateBlogGenerationSettingsMutation } from "@/server/convex/references/updateBlogGenerationSettingsMutation";
import { quickFillExistingTopicsMutation } from "@/server/convex/references/quickFillExistingTopicsMutation";
import { updateCalendarQueueSettingsMutation } from "@/server/convex/references/updateCalendarQueueSettingsMutation";
import { updateBlogImagesMutation } from "@/server/convex/references/updateBlogImagesMutation";
import { upsertGeneratedBlogMutation } from "@/server/convex/references/upsertGeneratedBlogMutation";
import { castTopicId } from "@/server/convex/castTopicId";
import { workspaceListPageSize } from "../constants/workspaceListPageSize";
import { useCursorPagination } from "./useCursorPagination";
import { useOneShotConvexQuery } from "./useOneShotConvexQuery";
import { buildInitialProductScanProduct } from "../mappers/buildInitialProductScanProduct";
import { buildPendingProductScanProduct } from "../mappers/buildPendingProductScanProduct";
import { mapConvexBlog } from "../mappers/mapConvexBlog";
import { mapConvexBlogSummary } from "../mappers/mapConvexBlogSummary";
import { mapConvexProduct } from "../mappers/mapConvexProduct";
import { mapConvexTopic } from "../mappers/mapConvexTopic";
import { mapProductScanResult } from "../mappers/mapProductScanResult";
import { buildBlogRefreshSeedKeyword } from "../utils/buildBlogRefreshSeedKeyword";
import { filterActiveLinks } from "../utils/filterActiveLinks";
import { formatCalendarMonthLabel } from "../utils/formatCalendarMonthLabel";
import { getCalendarMonthDateKeys } from "../utils/getCalendarMonthDateKeys";
import { getCalendarMonthStartDate } from "../utils/getCalendarMonthStartDate";
import { getSchedulableCalendarDateKeys } from "../utils/getSchedulableCalendarDateKeys";
import { buildCalendarQueueDateKeys } from "../utils/buildCalendarQueueDateKeys";
import { normalizeCalendarQueueSettings } from "../utils/normalizeCalendarQueueSettings";
import { canAddTopicToCalendar } from "../utils/canAddTopicToCalendar";
import { getScheduledAwareTopicStatus } from "../utils/getScheduledAwareTopicStatus";
import { isSameCalendarMonth } from "../utils/isSameCalendarMonth";
import { mergeProductLinkStates } from "../utils/mergeProductLinkStates";
import { mergePreviewBlogs } from "../utils/mergePreviewBlogs";
import { normalizeBlogGenerationSettings } from "../utils/normalizeBlogGenerationSettings";
import { setProductLinkActiveState } from "../utils/setProductLinkActiveState";
import { shiftCalendarMonthDate } from "../utils/shiftCalendarMonthDate";
import { waitForTopicDiscoveryJob } from "../utils/waitForTopicDiscoveryJob";
import type { CalendarBatchPlanResponse } from "../types/calendar/CalendarBatchPlanResponse";
import type { BlogGenerateResponse } from "../types/BlogGenerateResponse";
import type { BlogGenerationSettings } from "../types/BlogGenerationSettings";
import type { BlogListViewState } from "../types/BlogListViewState";
import type { BlogItem } from "../types/BlogItem";
import type { BlogStatusFilter } from "../types/BlogStatusFilter";
import type { ProductProfile } from "../types/ProductProfile";
import type { ProductLinksRefreshResponse } from "../types/ProductLinksRefreshResponse";
import type { ProductDetailsDraft } from "../types/ProductDetailsDraft";
import type { ProductScanResponse } from "../types/ProductScanResponse";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";
import type { TopicItem } from "../types/TopicItem";
import type { TopicListViewState } from "../types/TopicListViewState";
import type { TopicStatusFilter } from "../types/TopicStatusFilter";
import type { WorkspaceSummary } from "../types/WorkspaceSummary";
import type { WorkspaceSwitcherState } from "../types/WorkspaceSwitcherState";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";
import type { BlogPublishingIntegrationDraft } from "../types/integrations/BlogPublishingIntegrationDraft";
import type { TopicDiscoveryRequest } from "../types/topicDiscovery/TopicDiscoveryRequest";
import type { TopicDiscoveryResponse } from "../types/topicDiscovery/TopicDiscoveryResponse";
import type { UpdateBlogImages } from "../types/UpdateBlogImages";
import type { CalendarQueueSettings } from "../types/CalendarQueueSettings";

export const useLiveWorkspace = (
  initialMode: WorkspaceViewMode,
  workspaceSwitcher: WorkspaceSwitcherState,
) => {
  const convex = useConvex();
  const activeProductId = workspaceSwitcher.activeWorkspaceId;
  const [mode, setMode] = useState<WorkspaceViewMode>(initialMode);
  const [selectedBlogSelection, setSelectedBlogSelection] = useState<{
    blog?: BlogItem;
    blogId: string;
    productId: string;
  } | null>(null);
  const [scannedProduct, setScannedProduct] = useState<{
    product: ProductProfile;
    productId: string;
  } | null>(null);
  const [productScanMessage, setProductScanMessage] = useState("");
  const [isScanningProduct, setIsScanningProduct] = useState(false);
  const [productLinksMessage, setProductLinksMessage] = useState("");
  const [productDetailsMessage, setProductDetailsMessage] = useState("");
  const [isSavingProductDetails, setIsSavingProductDetails] = useState(false);
  const [isRefreshingProductLinks, setIsRefreshingProductLinks] =
    useState(false);
  const [settingsStatusMessage, setSettingsStatusMessage] = useState("");
  const [
    publishingIntegrationStatusMessage,
    setPublishingIntegrationStatusMessage,
  ] = useState("");
  const [isSavingBlogGenerationSettings, setIsSavingBlogGenerationSettings] =
    useState(false);
  const [
    isSavingBlogPublishingIntegration,
    setIsSavingBlogPublishingIntegration,
  ] = useState(false);
  const [topicStatusFilter, setTopicStatusFilter] =
    useState<TopicStatusFilter>("saved");
  const [topicSearchQuery, setTopicSearchQuery] = useState("");
  const [blogStatusFilter, setBlogStatusFilter] =
    useState<BlogStatusFilter>("unpublished");
  const [blogSearchQuery, setBlogSearchQuery] = useState("");
  const [blogTopicFilter, setBlogTopicFilter] = useState("all");
  const [calendarMessageState, setCalendarMessageState] = useState({
    message: "",
    productId: "",
  });
  const [fillingCalendarProductId, setFillingCalendarProductId] = useState("");
  const [quickFillingCalendarProductId, setQuickFillingCalendarProductId] = useState("");
  const [savingCalendarQueueProductId, setSavingCalendarQueueProductId] = useState("");
  const calendarMessage =
    calendarMessageState.productId === activeProductId
      ? calendarMessageState.message
      : "";
  const isFillingCalendar = Boolean(fillingCalendarProductId);
  const isQuickFillingCalendar = Boolean(quickFillingCalendarProductId);
  const isSavingCalendarQueueSettings = savingCalendarQueueProductId === activeProductId;
  const setCalendarMessage = (message: string) =>
    setCalendarMessageState({ message, productId: activeProductId });
  const setIsFillingCalendar = (isFilling: boolean) =>
    setFillingCalendarProductId(isFilling ? activeProductId : "");
  const setIsQuickFillingCalendar = (isFilling: boolean) =>
    setQuickFillingCalendarProductId(isFilling ? activeProductId : "");
  const setIsSavingCalendarQueueSettings = (isSaving: boolean) =>
    setSavingCalendarQueueProductId(isSaving ? activeProductId : "");
  const calendarFillActionRef = useRef<"ai" | "quick" | null>(null);
  const [readQueryRefreshKey, setReadQueryRefreshKey] = useState(0);
  const [calendarMonthDate, setCalendarMonthDate] = useState(() =>
    getCalendarMonthStartDate(new Date()),
  );
  const backfilledCalendarKeyRef = useRef("");
  const calendarDateKeys = useMemo(
    () => getCalendarMonthDateKeys(calendarMonthDate),
    [calendarMonthDate],
  );
  const fillableCalendarDateKeys = useMemo(
    () => getSchedulableCalendarDateKeys(calendarDateKeys),
    [calendarDateKeys],
  );
  const monthLabel = useMemo(
    () => formatCalendarMonthLabel(calendarMonthDate),
    [calendarMonthDate],
  );
  const isCurrentMonth = useMemo(
    () => isSameCalendarMonth(calendarMonthDate, new Date()),
    [calendarMonthDate],
  );
  const goToCurrentMonth = useCallback(() => {
    setCalendarMonthDate(getCalendarMonthStartDate(new Date()));
  }, []);
  const goToNextMonth = useCallback(() => {
    setCalendarMonthDate((current) => shiftCalendarMonthDate(current, 1));
  }, []);
  const goToPreviousMonth = useCallback(() => {
    setCalendarMonthDate((current) => shiftCalendarMonthDate(current, -1));
  }, []);
  const {
    canGoPrevious: canGoToPreviousTopicPage,
    goToNextPage: goToNextTopicPage,
    goToPreviousPage: goToPreviousTopicPage,
    pageCursor: topicPageCursor,
    pageNumber: topicPageNumber,
    resetPagination: resetTopicPagination,
  } = useCursorPagination();
  const {
    canGoPrevious: canGoToPreviousBlogPage,
    goToNextPage: goToNextBlogPage,
    goToPreviousPage: goToPreviousBlogPage,
    pageCursor: blogPageCursor,
    pageNumber: blogPageNumber,
    resetPagination: resetBlogPagination,
  } = useCursorPagination();
  const activeProductIdRef = useRef(activeProductId);
  const ensuredReadModelProductRef = useRef("");
  const selectedBlogId =
    selectedBlogSelection?.productId === activeProductId
      ? selectedBlogSelection.blogId
      : "";
  const convexProductId = activeProductId
    ? castProductId(activeProductId)
    : null;

  useEffect(() => {
    activeProductIdRef.current = activeProductId;
  }, [activeProductId]);
  const convexSelectedBlogId = selectedBlogId ? castBlogId(selectedBlogId) : null;
  const productProfileResult = useQuery(
    getCurrentProductProfileQuery,
    activeProductId ? {} : "skip",
  );
  const selectedBlogResult = useQuery(
    getBlogQuery,
    convexProductId && convexSelectedBlogId
      ? { blogId: convexSelectedBlogId, productId: convexProductId }
      : "skip",
  );
  const refreshReadQueries = useCallback(() => {
    setReadQueryRefreshKey((current) => current + 1);
  }, []);
  const loadFullProduct = useCallback(async () => {
    if (!activeProductId) {
      return null;
    }

    return await convex.query(getCurrentProductQuery, {});
  }, [activeProductId, convex]);
  const topicResultsQuery = useOneShotConvexQuery(
    listTopicsQuery,
    convexProductId && mode === "topics"
      ? {
          paginationOpts: {
            cursor: topicPageCursor,
            numItems: workspaceListPageSize,
          },
          productId: convexProductId,
          searchQuery: topicSearchQuery.trim(),
          ...(topicStatusFilter === "all" ? {} : { status: topicStatusFilter }),
        }
      : "skip",
    readQueryRefreshKey,
  );
  const topicResults = topicResultsQuery.result;
  const blogResultsQuery = useOneShotConvexQuery(
    listBlogsQuery,
    convexProductId && mode === "blogs"
      ? {
          paginationOpts: {
            cursor: blogPageCursor,
            numItems: workspaceListPageSize,
          },
          productId: convexProductId,
          searchQuery: blogSearchQuery.trim(),
          ...(blogStatusFilter === "all" ? {} : { status: blogStatusFilter }),
          ...(blogTopicFilter === "all"
            ? {}
            : { topicKeyword: blogTopicFilter }),
        }
      : "skip",
    readQueryRefreshKey,
  );
  const blogResults = blogResultsQuery.result;
  const blogTopicKeywordResultsQuery = useOneShotConvexQuery(
    listBlogTopicKeywordsQuery,
    convexProductId && (mode === "blogs" || mode === "calendar")
      ? { productId: convexProductId }
      : "skip",
    readQueryRefreshKey,
  );
  const blogTopicKeywordResults = blogTopicKeywordResultsQuery.result;
  const scheduledTopicResults = useQuery(
    listScheduledTopicsQuery,
    convexProductId && mode === "calendar"
      ? {
          endDate: calendarDateKeys[calendarDateKeys.length - 1],
          productId: convexProductId,
          startDate: calendarDateKeys[0],
        }
      : "skip",
  );
  const topicKeywordResultsQuery = useOneShotConvexQuery(
    listTopicKeywordsQuery,
    convexProductId && (mode === "calendar" || mode === "topics")
      ? { productId: convexProductId }
      : "skip",
    readQueryRefreshKey,
  );
  const topicKeywordResults = topicKeywordResultsQuery.result;
  const workspaceSummaryResultQuery = useOneShotConvexQuery(
    getWorkspaceSummaryQuery,
    convexProductId && mode === "dashboard"
      ? { productId: convexProductId }
      : "skip",
    readQueryRefreshKey,
  );
  const workspaceSummaryResult = workspaceSummaryResultQuery.result;
  const backfillWrittenTopicCalendarDates = useMutation(
    backfillWrittenTopicCalendarDatesMutation,
  );
  const createScheduledTopic = useMutation(createScheduledTopicMutation);
  const createScheduledTopicBatch = useMutation(
    createScheduledTopicBatchMutation,
  );
  const quickFillExistingTopics = useMutation(quickFillExistingTopicsMutation);
  const updateCalendarQueueSettings = useMutation(updateCalendarQueueSettingsMutation);
  const createTopic = useMutation(createTopicMutation);
  const deleteBlogRecord = useMutation(deleteBlogMutation);
  const deleteTopicRecord = useMutation(deleteTopicMutation);
  const ensureWorkspaceReadModels = useMutation(
    ensureWorkspaceReadModelsMutation,
  );
  const saveProductScan = useMutation(saveProductScanMutation);
  const updateProductSiteLinks = useMutation(updateProductSiteLinksMutation);
  const updateProductDetails = useMutation(updateProductDetailsMutation);
  const updateBlogGenerationSettings = useMutation(
    updateBlogGenerationSettingsMutation,
  );
  const updateBlogImagesRecord = useMutation(updateBlogImagesMutation);
  const updateBlogPublishingIntegration = useMutation(
    updateBlogPublishingIntegrationMutation,
  );
  const updateTopicNotes = useMutation(updateTopicNotesMutation);
  const updateTopicScheduledDate = useMutation(
    updateTopicScheduledDateMutation,
  );
  const updateTopicStatus = useMutation(updateTopicStatusMutation);
  const upsertGeneratedBlog = useMutation(upsertGeneratedBlogMutation);

  useEffect(() => {
    resetTopicPagination();
  }, [
    activeProductId,
    resetTopicPagination,
    topicSearchQuery,
    topicStatusFilter,
  ]);

  useEffect(() => {
    resetBlogPagination();
  }, [
    activeProductId,
    blogSearchQuery,
    blogStatusFilter,
    blogTopicFilter,
    resetBlogPagination,
  ]);

  useEffect(() => {
    if (!convexProductId || !activeProductId) {
      ensuredReadModelProductRef.current = "";
      return;
    }

    if (ensuredReadModelProductRef.current === activeProductId) {
      return;
    }

    ensuredReadModelProductRef.current = activeProductId;

    void ensureWorkspaceReadModels({ productId: convexProductId })
      .then((result) => {
        if (result.rebuilt) {
          refreshReadQueries();
        }
      })
      .catch(() => undefined);
  }, [
    activeProductId,
    convexProductId,
    ensureWorkspaceReadModels,
    refreshReadQueries,
  ]);

  useEffect(() => {
    if (!convexProductId || mode !== "calendar") {
      return;
    }

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const backfillKey = `${activeProductId}:${timeZone}`;

    if (backfilledCalendarKeyRef.current === backfillKey) {
      return;
    }

    backfilledCalendarKeyRef.current = backfillKey;
    void backfillWrittenTopicCalendarDates({
      productId: convexProductId,
      timeZone,
    }).catch(() => {
      backfilledCalendarKeyRef.current = "";
    });
  }, [
    activeProductId,
    backfillWrittenTopicCalendarDates,
    convexProductId,
    mode,
  ]);

  const visibleScannedProduct =
    scannedProduct?.productId === activeProductId ? scannedProduct.product : null;
  const product = visibleScannedProduct || mapConvexProduct(productProfileResult);
  const blogGenerationSettings = normalizeBlogGenerationSettings(
    productProfileResult?.blogGenerationSettings,
  );
  const calendarQueueSettings = normalizeCalendarQueueSettings(productProfileResult?.calendarQueueSettings);
  const topics = useMemo(
    () => (topicResults?.page || []).map(mapConvexTopic),
    [topicResults],
  );
  const blogs: BlogItem[] = useMemo(
    () => (blogResults?.page || []).map(mapConvexBlogSummary),
    [blogResults],
  );
  const calendarTopics = useMemo(
    () => (scheduledTopicResults || []).map(mapConvexTopic),
    [scheduledTopicResults],
  );
  const occupiedCalendarDateSet = useMemo(() => new Set(calendarTopics.map((topic) => topic.scheduledDate).filter((date): date is string => Boolean(date))), [calendarTopics]);
  const queueDateKeys = useMemo(() => buildCalendarQueueDateKeys({ candidateDateKeys: fillableCalendarDateKeys, settings: calendarQueueSettings, stableSeed: activeProductId }), [activeProductId, calendarQueueSettings, fillableCalendarDateKeys]);
  const openQueueDateKeys = useMemo(() => queueDateKeys.filter((date) => !occupiedCalendarDateSet.has(date)), [occupiedCalendarDateSet, queueDateKeys]);
  const actionQueueDateKeys = useMemo(() => openQueueDateKeys.slice(0, 30), [openQueueDateKeys]);
  const visibleTopics = useMemo(() => {
    const topicMap = new Map<string, ReturnType<typeof mapConvexTopic>>();

    [...topics, ...calendarTopics].forEach((topic) => {
      topicMap.set(topic.id, topic);
    });

    return Array.from(topicMap.values());
  }, [calendarTopics, topics]);
  const schedulableTopics = useMemo(() => {
    const topicMap = new Map<string, TopicItem>();

    (topicKeywordResults || []).forEach((topic) => {
      if (!topic.id) {
        return;
      }

      topicMap.set(topic.id, {
        blogId: topic.blogId,
        canonicalKeyword: topic.canonicalKeyword,
        id: topic.id,
        intentKey: topic.intentKey,
        keyword: topic.keyword,
        notes: topic.notes,
        scheduledDate: topic.scheduledDate,
        sourceType: topic.sourceType,
        status: getScheduledAwareTopicStatus({
          scheduledDate: topic.scheduledDate,
          status: topic.status,
        }),
      });
    });

    [...visibleTopics, ...calendarTopics].forEach((topic) => {
      topicMap.set(topic.id, topic);
    });

    return Array.from(topicMap.values());
  }, [calendarTopics, topicKeywordResults, visibleTopics]);
  const knownEligibleTopicCount = useMemo(() => schedulableTopics.filter((topic) => !topic.scheduledDate && canAddTopicToCalendar(topic)).length, [schedulableTopics]);
  const calendarState = useMemo(
    () => ({
      dateKeys: calendarDateKeys,
      fillableDateKeys: fillableCalendarDateKeys,
      goToCurrentMonth,
      goToNextMonth,
      goToPreviousMonth,
      isCurrentMonth,
      isFilling: isFillingCalendar,
      isQuickFilling: isQuickFillingCalendar,
      isSavingQueueSettings: isSavingCalendarQueueSettings,
      isLoading: Boolean(
        convexProductId &&
          mode === "calendar" &&
          (!scheduledTopicResults || topicKeywordResultsQuery.isLoading),
      ),
      message: calendarMessage,
      monthLabel,
      calendarQueueSettings,
      openQueueDateKeys,
      queueDateKeys,
    }),
    [
      calendarDateKeys,
      calendarMessage,
      fillableCalendarDateKeys,
      convexProductId,
      goToCurrentMonth,
      goToNextMonth,
      goToPreviousMonth,
      isCurrentMonth,
      isFillingCalendar,
      isQuickFillingCalendar,
      isSavingCalendarQueueSettings,
      mode,
      monthLabel,
      scheduledTopicResults,
      topicKeywordResultsQuery.isLoading,
      calendarQueueSettings,
      openQueueDateKeys,
      queueDateKeys,
    ],
  );
  const blogTopicOptions = useMemo(
    () => [
      { label: "All topics", value: "all" },
      ...(blogTopicKeywordResults || []).map((topic) => ({
        label: topic,
        value: topic,
      })),
    ],
    [blogTopicKeywordResults],
  );
  const workspaceSummary: WorkspaceSummary | undefined = useMemo(
    () =>
      workspaceSummaryResult
        ? {
            blogCount: workspaceSummaryResult.blogCount,
            imageCount: workspaceSummaryResult.imageCount,
            publishedBlogCount: workspaceSummaryResult.publishedBlogCount,
            recentBlogs:
              workspaceSummaryResult.recentBlogs.map(mapConvexBlogSummary),
            topicCount: workspaceSummaryResult.topicCount,
          }
        : undefined,
    [workspaceSummaryResult],
  );
  const setSelectedBlogId = useCallback(
    (blogId: string) => {
      const selectedBlog =
        blogs.find((blog) => blog.id === blogId) ||
        workspaceSummary?.recentBlogs.find((blog) => blog.id === blogId);

      setSelectedBlogSelection(
        blogId && activeProductId
          ? { blog: selectedBlog, blogId, productId: activeProductId }
          : null,
      );
    },
    [activeProductId, blogs, workspaceSummary?.recentBlogs],
  );
  const selectedBlogFromQuery = useMemo(
    () => (selectedBlogResult ? mapConvexBlog(selectedBlogResult) : undefined),
    [selectedBlogResult],
  );
  const topicListState: TopicListViewState = useMemo(
    () => ({
      activeFilter: topicStatusFilter,
      pagination: {
        canGoNext: Boolean(topicResults && !topicResults.isDone),
        canGoPrevious: canGoToPreviousTopicPage,
        goToNextPage: () => {
          if (topicResults && !topicResults.isDone) {
            goToNextTopicPage(topicResults.continueCursor);
          }
        },
        goToPreviousPage: goToPreviousTopicPage,
        isLoading: Boolean(
          convexProductId &&
            mode === "topics" &&
            (topicResultsQuery.isLoading || !topicResults),
        ),
        pageNumber: topicPageNumber,
      },
      searchQuery: topicSearchQuery,
      setActiveFilter: setTopicStatusFilter,
      setSearchQuery: setTopicSearchQuery,
    }),
    [
      convexProductId,
      canGoToPreviousTopicPage,
      goToNextTopicPage,
      goToPreviousTopicPage,
      mode,
      topicPageNumber,
      topicResults,
      topicResultsQuery.isLoading,
      topicSearchQuery,
      topicStatusFilter,
    ],
  );
  const blogListState: BlogListViewState = useMemo(
    () => ({
      activeFilter: blogStatusFilter,
      pagination: {
        canGoNext: Boolean(blogResults && !blogResults.isDone),
        canGoPrevious: canGoToPreviousBlogPage,
        goToNextPage: () => {
          if (blogResults && !blogResults.isDone) {
            goToNextBlogPage(blogResults.continueCursor);
          }
        },
        goToPreviousPage: goToPreviousBlogPage,
        isLoading: Boolean(
          convexProductId &&
            mode === "blogs" &&
            (blogResultsQuery.isLoading || !blogResults),
        ),
        pageNumber: blogPageNumber,
      },
      searchQuery: blogSearchQuery,
      setActiveFilter: setBlogStatusFilter,
      setSearchQuery: setBlogSearchQuery,
      setTopicFilter: setBlogTopicFilter,
      topicFilter: blogTopicFilter,
      topicOptions: blogTopicOptions,
    }),
    [
      canGoToPreviousBlogPage,
      blogPageNumber,
      blogResults,
      blogResultsQuery.isLoading,
      blogSearchQuery,
      blogStatusFilter,
      blogTopicFilter,
      blogTopicOptions,
      convexProductId,
      goToNextBlogPage,
      goToPreviousBlogPage,
      mode,
    ],
  );
  const previewBlogs = useMemo(
    () =>
      mergePreviewBlogs({
        currentPageBlogs: blogs,
        recentBlogs: workspaceSummary?.recentBlogs,
        selectedBlog: selectedBlogFromQuery || selectedBlogSelection?.blog,
      }),
    [blogs, selectedBlogFromQuery, selectedBlogSelection?.blog, workspaceSummary],
  );
  const selectedBlog = useMemo(
    () =>
      selectedBlogId
        ? previewBlogs.find((blog) => blog.id === selectedBlogId)
        : undefined,
    [previewBlogs, selectedBlogId],
  );

  const scanProduct = async (websiteUrl: string, niche: string) => {
    setIsScanningProduct(true);
    setProductScanMessage("Scanning your site.");
    let savedInitialProduct = false;

    try {
      const initialProduct = buildInitialProductScanProduct({
        niche,
        websiteUrl,
      });
      const pendingProduct = buildPendingProductScanProduct({
        existingSiteLinks: convexProductId ? product.siteLinks : undefined,
        initialProduct,
      });

      const savedProductId = await saveProductScan({
        ...pendingProduct,
        preserveSiteLinks: Boolean(convexProductId),
        productId: convexProductId || undefined,
      });
      savedInitialProduct = true;
      setScannedProduct({
        product: mapProductScanResult(pendingProduct),
        productId: savedProductId,
      });
      setProductScanMessage("Saved your site. Scanning for details.");

      const response = await fetch("/api/product/scan", {
        body: JSON.stringify({ niche, productId: savedProductId, websiteUrl }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = (await response
        .json()
        .catch(() => ({}))) as ProductScanResponse;

      if (!response.ok) {
        throw new Error(data.error || "Could not scan that site yet.");
      }

      if (data.product) {
        const scannedProduct = {
          ...data.product,
          externalLinks: data.product.externalLinks || [],
          features: data.product.features || [],
          offers: data.product.offers || [],
          pricing: data.product.pricing || [],
        };
        const siteLinks = mergeProductLinkStates({
          currentLinks: product.siteLinks,
          refreshedLinks: scannedProduct.siteLinks,
        });
        const savedProductId = await saveProductScan({
          ...scannedProduct,
          siteLinks,
          productId: convexProductId || undefined,
        });
        setScannedProduct({
          product: mapProductScanResult({ ...scannedProduct, siteLinks }),
          productId: savedProductId,
        });
      }

      setProductScanMessage(
        data.status && data.status !== "succeeded"
          ? "Scanning in the background. You can leave and come back."
          : "Saved your product details.",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not scan that site yet.";

      setProductScanMessage(
        savedInitialProduct ? `${message} We still saved your site.` : message,
      );
    } finally {
      setIsScanningProduct(false);
    }
  };

  const refreshProductLinks = async () => {
    if (!convexProductId) {
      setProductLinksMessage("Choose a workspace first.");
      return;
    }

    if (!product.websiteUrl.trim()) {
      setProductLinksMessage("Add your website first.");
      return;
    }

    setIsRefreshingProductLinks(true);
    setProductLinksMessage("Refreshing links.");

    try {
      const response = await fetch("/api/product/links/refresh", {
        body: JSON.stringify({ websiteUrl: product.websiteUrl }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = (await response
        .json()
        .catch(() => ({}))) as ProductLinksRefreshResponse;

      if (!response.ok || !data.siteLinks) {
        throw new Error(data.error || "Could not refresh links yet.");
      }

      const siteLinks = mergeProductLinkStates({
        currentLinks: product.siteLinks,
        refreshedLinks: data.siteLinks,
      });

      await updateProductSiteLinks({
        productId: convexProductId,
        siteLinks,
      });
      setScannedProduct({
        product: {
          ...product,
          siteLinks,
        },
        productId: activeProductId,
      });
      setProductLinksMessage("Links refreshed.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not refresh links yet.";
      setProductLinksMessage(message);
    } finally {
      setIsRefreshingProductLinks(false);
    }
  };

  const setProductLinkActive = async (url: string, isActive: boolean) => {
    if (!convexProductId) {
      setProductLinksMessage("Choose a workspace first.");
      return;
    }

    const siteLinks = setProductLinkActiveState({
      isActive,
      links: product.siteLinks,
      url,
    });

    try {
      await updateProductSiteLinks({
        productId: convexProductId,
        siteLinks,
      });
      setScannedProduct({
        product: {
          ...product,
          siteLinks,
        },
        productId: activeProductId,
      });
      setProductLinksMessage(
        isActive ? "Link turned back on." : "Link paused.",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not save that link.";
      setProductLinksMessage(message);
    }
  };

  const saveProductDetails = async (details: ProductDetailsDraft) => {
    if (!convexProductId || !activeProductId) {
      setProductDetailsMessage("Choose a workspace first.");
      return;
    }

    setIsSavingProductDetails(true);
    setProductDetailsMessage("");

    try {
      await updateProductDetails({
        ...details,
        productId: convexProductId,
      });
      setScannedProduct({
        product: {
          ...product,
          ...details,
          updatedAt: Date.now(),
        },
        productId: activeProductId,
      });
      setProductDetailsMessage("Product details saved.");
    } catch (error) {
      setProductDetailsMessage(
        error instanceof Error
          ? error.message
          : "Could not save your product details.",
      );
    } finally {
      setIsSavingProductDetails(false);
    }
  };

  const addTopic = async (keyword: string, notes?: string) => {
    if (!convexProductId) {
      return;
    }

    await createTopic({
      keyword,
      notes,
      productId: convexProductId,
    });
    resetTopicPagination();
    refreshReadQueries();
  };

  const addScheduledTopic = async (
    keyword: string,
    scheduledDate: string,
    notes?: string,
  ) => {
    if (!convexProductId) {
      return;
    }

    await createScheduledTopic({
      keyword,
      notes,
      productId: convexProductId,
      scheduledDate,
      sourceType: "manual",
    });
    setCalendarMessage("Topic added.");
    resetTopicPagination();
    refreshReadQueries();
  };

  const removeTopicFromCalendar = async (topicId: string) => {
    if (!convexProductId) {
      return;
    }

    await updateTopicScheduledDate({
      productId: convexProductId,
      scheduledDate: null,
      topicId: castTopicId(topicId),
    });
    setCalendarMessage("Topic removed from the calendar.");
    resetTopicPagination();
    refreshReadQueries();
  };

  const scheduleTopicOnCalendar = async (
    topicId: string,
    scheduledDate: string,
  ) => {
    if (!convexProductId) {
      return;
    }

    await updateTopicScheduledDate({
      productId: convexProductId,
      scheduledDate,
      topicId: castTopicId(topicId),
    });
    setCalendarMessage("Topic added to the calendar.");
    resetTopicPagination();
    refreshReadQueries();
  };

  const fillCalendarBlankDays = async () => {
    if (!convexProductId || calendarFillActionRef.current) {
      return;
    }

    const operationProductId = activeProductId;
    const blankDates = actionQueueDateKeys;

    if (blankDates.length === 0) {
      setCalendarMessage("No open queue dates are available in this month.");
      return;
    }

    calendarFillActionRef.current = "ai";
    setIsFillingCalendar(true);
    setCalendarMessage("Finding topics.");
    let fullProduct;

    try {
      fullProduct = await loadFullProduct();
    } catch (error) {
      calendarFillActionRef.current = null;
      setIsFillingCalendar(false);
      if (activeProductIdRef.current === operationProductId) {
        setCalendarMessage(
          error instanceof Error
            ? error.message
            : "Could not load this workspace.",
        );
      }
      return;
    }

    if (activeProductIdRef.current !== operationProductId) {
      if (calendarFillActionRef.current === "ai") {
        calendarFillActionRef.current = null;
      }
      setIsFillingCalendar(false);
      return;
    }
    const discoveryProduct = fullProduct
      ? {
          audience: fullProduct.audience,
          competitors: fullProduct.competitors,
          description: fullProduct.description,
          name: fullProduct.name,
          niche: fullProduct.niche,
          rawContext: fullProduct.rawContext,
          siteLinks: filterActiveLinks(fullProduct.siteLinks),
          websiteUrl: fullProduct.websiteUrl,
        }
      : {
          ...product,
          siteLinks: filterActiveLinks(product.siteLinks),
        };

    if (!discoveryProduct.niche?.trim() && !discoveryProduct.description?.trim()) {
      setCalendarMessage("Add a product niche before filling the calendar.");
      calendarFillActionRef.current = null;
      setIsFillingCalendar(false);
      return;
    }

    try {
      const response = await fetch("/api/topics/batch-plan", {
        body: JSON.stringify({
          blankDates,
          existingBlogs: (blogTopicKeywordResults || []).map((keyword) => ({
            keyword,
            title: keyword,
          })),
          existingTopics: topicKeywordResults || [],
          product: discoveryProduct,
          productId: activeProductId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = (await response
        .json()
        .catch(() => ({}))) as CalendarBatchPlanResponse;

      if (activeProductIdRef.current !== operationProductId) return;

      if (!response.ok || (!data.topics && !data.jobId)) {
        throw new Error(data.error || "Could not fill the calendar yet.");
      }

      if (data.createdCount !== undefined) {
        setCalendarMessage(
          data.createdCount > 0
            ? `Saved ${data.createdCount} new topics.`
            : "No unique topics found yet.",
        );
        resetTopicPagination();
        refreshReadQueries();
        return;
      }

      if (data.jobId && !data.topics) {
        setCalendarMessage("Filling the calendar in the background.");
        return;
      }

      const topics = data.topics || [];

      if (topics.length === 0) {
        setCalendarMessage("No unique topics found yet.");
        return;
      }

      const result = await createScheduledTopicBatch({
        productId: convexProductId,
        topics,
      });

      if (activeProductIdRef.current !== operationProductId) return;

      if (activeProductIdRef.current === operationProductId) setCalendarMessage(
        result.createdCount > 0
          ? `Saved ${result.createdCount} new topics.`
          : "No unique topics found yet.",
      );
      resetTopicPagination();
      refreshReadQueries();
    } catch (error) {
      if (activeProductIdRef.current === operationProductId) {
        setCalendarMessage(
          error instanceof Error
            ? error.message
            : "Could not fill the calendar yet.",
        );
      }
    } finally {
      if (calendarFillActionRef.current === "ai") {
        calendarFillActionRef.current = null;
      }
      setIsFillingCalendar(false);
    }
  };

  const quickFillCalendar = async () => {
    if (!convexProductId || calendarFillActionRef.current) return;
    if (!actionQueueDateKeys.length) { setCalendarMessage("All queue dates in this month are already filled."); return; }
    if (!knownEligibleTopicCount) { setCalendarMessage("No saved topics are available for quick fill."); return; }
    const operationProductId = activeProductId;
    calendarFillActionRef.current = "quick";
    setIsQuickFillingCalendar(true); setCalendarMessage("Scheduling.");
    try {
      const result = await quickFillExistingTopics({ productId: convexProductId, scheduledDates: actionQueueDateKeys });
      if (operationProductId !== activeProductIdRef.current) return;
      setCalendarMessage(result.scheduledCount ? `Scheduled ${result.scheduledCount} existing topics.${result.unusedDateCount ? ` ${result.unusedDateCount} queue dates remain open.` : ""}` : "No saved topics are available for quick fill.");
      resetTopicPagination(); refreshReadQueries();
    } catch (error) { if (operationProductId === activeProductIdRef.current) setCalendarMessage(error instanceof Error ? error.message : "Could not schedule existing topics."); }
    finally { if (calendarFillActionRef.current === "quick") calendarFillActionRef.current = null; setIsQuickFillingCalendar(false); }
  };

  const saveCalendarQueueSettings = async (settings: CalendarQueueSettings) => {
    if (!convexProductId) return;
    const operationProductId = activeProductId;
    const previous = calendarQueueSettings;
    const normalized = normalizeCalendarQueueSettings(settings);
    const next = normalized.cadence === "custom" && previous.cadence === "custom" && previous.intervalDays === normalized.intervalDays ? { ...normalized, anchorDate: previous.anchorDate } : normalized;
    setIsSavingCalendarQueueSettings(true);
    try { await updateCalendarQueueSettings({ productId: convexProductId, settings: next }); if (operationProductId === activeProductIdRef.current) { setCalendarMessage("Calendar queue saved."); refreshReadQueries(); } }
    catch (error) { if (operationProductId === activeProductIdRef.current) setCalendarMessage(error instanceof Error ? error.message : "Could not save the calendar queue."); }
    finally { setIsSavingCalendarQueueSettings(false); }
  };

  const discoverTopicIdeas = async ({
    includeAiAnswers,
    seedKeyword,
  }: TopicDiscoveryRequest) => {
    const fullProduct = await loadFullProduct();
    const discoveryProduct = fullProduct
      ? {
          audience: fullProduct.audience,
          competitors: fullProduct.competitors,
          description: fullProduct.description,
          name: fullProduct.name,
          niche: fullProduct.niche,
          rawContext: fullProduct.rawContext,
          siteLinks: filterActiveLinks(fullProduct.siteLinks),
          websiteUrl: fullProduct.websiteUrl,
        }
      : {
          ...product,
          siteLinks: filterActiveLinks(product.siteLinks),
        };

    if (
      !seedKeyword?.trim() &&
      !discoveryProduct.niche?.trim() &&
      !discoveryProduct.description?.trim()
    ) {
      throw new Error("Add a product niche or seed keyword first.");
    }

    const response = await fetch("/api/topics/discover", {
      body: JSON.stringify({
        existingBlogs: blogs.map((blog) => ({
          excerpt: blog.excerpt,
          keyword: blog.keyword,
          title: blog.title,
          updatedAt: blog.updatedAt,
        })),
        existingTopics: (topicKeywordResults || visibleTopics).map((topic) => ({
          keyword: topic.keyword,
        })),
        includeAiAnswers,
        product: discoveryProduct,
        productId: activeProductId,
        seedKeyword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const data = (await response
      .json()
      .catch(() => ({}))) as TopicDiscoveryResponse;

    if (!response.ok || (!data.discovery && !data.jobId)) {
      throw new Error(data.error || "Could not find topic ideas yet.");
    }

    if (!data.discovery && data.jobId) {
      return await waitForTopicDiscoveryJob(data.jobId);
    }

    return data.discovery!;
  };

  const refreshTopicBrief = async (topicId: string) => {
    const topic = visibleTopics.find((item) => item.id === topicId);

    if (!topic) {
      throw new Error("Topic not found.");
    }

    if (
      topic.blogId ||
      topic.status === "written" ||
      topic.status === "published"
    ) {
      throw new Error(
        "This brief is locked because its article is already written.",
      );
    }

    if (!convexProductId) {
      throw new Error("Choose a workspace first.");
    }

    const fullProduct = await loadFullProduct();
    const discoveryProduct = fullProduct
      ? {
          audience: fullProduct.audience,
          competitors: fullProduct.competitors,
          description: fullProduct.description,
          name: fullProduct.name,
          niche: fullProduct.niche,
          rawContext: fullProduct.rawContext,
          siteLinks: filterActiveLinks(fullProduct.siteLinks),
          websiteUrl: fullProduct.websiteUrl,
        }
      : {
          ...product,
          siteLinks: filterActiveLinks(product.siteLinks),
        };
    const response = await fetch(`/api/topics/${topicId}/brief`, {
      body: JSON.stringify({
        existingBlogs: blogs.map((blog) => ({
          excerpt: blog.excerpt,
          keyword: blog.keyword,
          title: blog.title,
          updatedAt: blog.updatedAt,
        })),
        existingTopics: (topicKeywordResults || visibleTopics).map((item) => ({
          keyword: item.keyword,
        })),
        includeAiAnswers: false,
        product: discoveryProduct,
        productId: activeProductId,
        seedKeyword: topic.keyword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      jobId?: string;
      notes?: string;
      status?: "queued" | "running" | "succeeded" | "failed";
    };

    if (!response.ok || (!data.notes && !data.jobId)) {
      throw new Error(data.error || "Could not find a brief yet.");
    }

    const notes = data.notes || "";

    if (!notes.trim()) {
      throw new Error("Brief search started in the background.");
    }

    return notes;
  };

  const saveTopicBrief = async (topicId: string, notes: string) => {
    const topic = visibleTopics.find((item) => item.id === topicId);
    const trimmedNotes = notes.trim();

    if (!topic) {
      throw new Error("Topic not found.");
    }

    if (
      topic.blogId ||
      topic.status === "written" ||
      topic.status === "published"
    ) {
      throw new Error(
        "This brief is locked because its article is already written.",
      );
    }

    if (!convexProductId) {
      throw new Error("Choose a workspace first.");
    }

    await updateTopicNotes({
      notes: trimmedNotes || undefined,
      productId: convexProductId,
      topicId: castTopicId(topicId),
    });
    refreshReadQueries();

    return trimmedNotes;
  };

  const deleteTopic = async (topicId: string) => {
    await deleteTopicRecord({
      productId: convexProductId || undefined,
      topicId: castTopicId(topicId),
    });
    resetTopicPagination();
    refreshReadQueries();
  };

  const discoverBlogRefreshIdeas = async (
    blogId: string,
    { includeAiAnswers, seedKeyword }: TopicDiscoveryRequest,
  ) => {
    const blog = blogs.find((item) => item.id === blogId);

    if (!blog) {
      throw new Error("Blog not found.");
    }

    const fullProduct = await loadFullProduct();
    const discoveryProduct = fullProduct
      ? {
          audience: fullProduct.audience,
          competitors: fullProduct.competitors,
          description: fullProduct.description,
          name: fullProduct.name,
          niche: fullProduct.niche,
          rawContext: fullProduct.rawContext,
          siteLinks: filterActiveLinks(fullProduct.siteLinks),
          websiteUrl: fullProduct.websiteUrl,
        }
      : {
          ...product,
          siteLinks: filterActiveLinks(product.siteLinks),
        };
    const searchKeyword =
      seedKeyword?.trim() || buildBlogRefreshSeedKeyword(blog);

    if (!searchKeyword) {
      throw new Error("Add a keyword or title before searching.");
    }

    const response = await fetch("/api/topics/discover", {
      body: JSON.stringify({
        existingBlogs: [
          {
            excerpt: blog.excerpt,
            keyword: blog.keyword,
            title: blog.title,
            updatedAt: blog.updatedAt,
          },
        ],
        existingTopics: visibleTopics.map((topic) => ({
          keyword: topic.keyword,
        })),
        includeAiAnswers,
        product: discoveryProduct,
        productId: activeProductId,
        seedKeyword: searchKeyword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const data = (await response
      .json()
      .catch(() => ({}))) as TopicDiscoveryResponse;

    if (!response.ok || (!data.discovery && !data.jobId)) {
      throw new Error(data.error || "Could not find refresh ideas yet.");
    }

    if (!data.discovery && data.jobId) {
      return await waitForTopicDiscoveryJob(data.jobId);
    }

    return data.discovery!;
  };

  const saveBlogGenerationSettings = async (
    settings: BlogGenerationSettings,
  ) => {
    if (!convexProductId) {
      setSettingsStatusMessage("Choose a workspace first.");
      return;
    }

    setIsSavingBlogGenerationSettings(true);
    setSettingsStatusMessage("");

    try {
      await updateBlogGenerationSettings({
        productId: convexProductId,
        settings,
      });
      setSettingsStatusMessage("Settings saved.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not save settings.";
      setSettingsStatusMessage(message);
    } finally {
      setIsSavingBlogGenerationSettings(false);
    }
  };

  const saveBlogPublishingIntegration = async (
    integration: BlogPublishingIntegrationDraft,
  ) => {
    if (!convexProductId) {
      setPublishingIntegrationStatusMessage("Choose a workspace first.");
      return;
    }

    setIsSavingBlogPublishingIntegration(true);
    setPublishingIntegrationStatusMessage("");

    try {
      await updateBlogPublishingIntegration({
        accessToken: integration.accessToken,
        enabled: integration.enabled,
        productId: convexProductId,
        sourceName: integration.sourceName,
        webhookUrl: integration.webhookUrl,
      });
      setPublishingIntegrationStatusMessage(
        integration.enabled ? "Publishing connected." : "Publishing removed.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not save publishing yet.";
      setPublishingIntegrationStatusMessage(message);
    } finally {
      setIsSavingBlogPublishingIntegration(false);
    }
  };

  const writeBlog = async (topicId: string, options?: WriteBlogOptions) => {
    const topic = visibleTopics.find((item) => item.id === topicId);
    const sourceText = options?.sourceText?.trim();

    if (!topic) {
      return;
    }

    const convexTopicId = castTopicId(topicId);

    if (!convexProductId) {
      return;
    }

    const fullProduct = await loadFullProduct();

    if (!fullProduct) {
      await updateTopicStatus({
        lastError: "Scan your product website first.",
        productId: convexProductId || undefined,
        status: "failed",
        topicId: convexTopicId,
      }).catch(() => undefined);
      refreshReadQueries();
      return;
    }

    await updateTopicStatus({
      productId: convexProductId || undefined,
      status: "writing",
      topicId: convexTopicId,
    });
    refreshReadQueries();

    try {
      const response = await fetch("/api/blogs/generate", {
        body: JSON.stringify({
          blogGenerationSettings,
          keyword: topic.keyword,
          product: fullProduct,
          productId: activeProductId,
          sourceText: sourceText || undefined,
          topicBrief: topic.notes,
          topicId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = (await response
        .json()
        .catch(() => ({}))) as BlogGenerateResponse;

      if (!response.ok || (!data.blog && !data.blogId && !data.jobId)) {
        throw new Error(data.error || "Could not write that blog yet.");
      }

      const blogId =
        data.blogId ||
        (data.blog
          ? await upsertGeneratedBlog({
              ...data.blog,
              productId: convexProductId,
              topicId: convexTopicId,
            })
          : "");

      if (blogId) {
        setSelectedBlogId(blogId);
        resetBlogPagination();
        refreshReadQueries();
        setMode("blogs");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not write that blog yet.";
      await updateTopicStatus({
        lastError: message,
        productId: convexProductId || undefined,
        status: "failed",
        topicId: convexTopicId,
      }).catch(() => undefined);
      refreshReadQueries();
    }
  };

  const deleteBlog = async (blogId: string) => {
    await deleteBlogRecord({
      blogId: castBlogId(blogId),
      productId: convexProductId || undefined,
    });
    resetBlogPagination();
    refreshReadQueries();

    if (selectedBlogId === blogId) {
      setSelectedBlogId("");
    }
  };

  const regenerateImage = async (
    blogId: string,
    options: {
      alt?: string;
      imageIndex?: number;
      isFeatureImage?: boolean;
      prompt?: string;
      src?: string;
    },
  ) => {
    const response = await fetch(`/api/blogs/${blogId}/regenerate-image`, {
      body: JSON.stringify({
        alt: options.alt,
        imageIndex: options.imageIndex,
        isFeatureImage: options.isFeatureImage,
        productId: activeProductId,
        prompt: options.prompt,
        src: options.src,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      const data = (await response
        .json()
        .catch(() => ({}))) as { error?: string };
      throw new Error(data.error || "Could not refresh that image.");
    }

    refreshReadQueries();
  };

  const updateBlogImages: UpdateBlogImages = async (blogId, changes) => {
    if (!convexProductId) {
      throw new Error("Choose a workspace first.");
    }

    await updateBlogImagesRecord({
      blogId: castBlogId(blogId),
      featureImageUrl: changes.featureImageUrl,
      images: changes.images,
      mdx: changes.mdx,
      productId: convexProductId,
    });
    refreshReadQueries();
  };

  return {
    addScheduledTopic,
    addTopic,
    blogGenerationSettings,
    blogListState,
    blogs,
    calendarState,
    calendarTopics,
    deleteBlog,
    deleteTopic,
    discoverBlogRefreshIdeas,
    discoverTopicIdeas,
    fillCalendarBlankDays,
    quickFillCalendar,
    saveCalendarQueueSettings,
    knownEligibleTopicCount,
    isSavingBlogPublishingIntegration,
    isSavingBlogGenerationSettings,
    mode,
    product,
    productLinksState: {
      isRefreshing: isRefreshingProductLinks,
      message: productLinksMessage,
    },
    productDetailsState: {
      isSaving: isSavingProductDetails,
      message: productDetailsMessage,
    },
    publishingIntegrationStatusMessage,
    productScanState: {
      isScanning: isScanningProduct,
      message: productScanMessage,
    },
    regenerateImage,
    refreshProductLinks,
    refreshTopicBrief,
    removeTopicFromCalendar,
    saveTopicBrief,
    saveProductDetails,
    saveBlogGenerationSettings,
    saveBlogPublishingIntegration,
    schedulableTopics,
    scheduleTopicOnCalendar,
    scanProduct,
    selectedBlog,
    selectedBlogId,
    settingsStatusMessage,
    setProductLinkActive,
    setMode,
    setSelectedBlogId,
    topics,
    topicListState,
    updateBlogImages,
    workspaceSummary,
    workspaceSwitcher,
    writeBlog,
  };
};
