"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, Minus, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type VehicleGalleryProps = {
  images: string[];
  vehicleName: string;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.5;

export function VehicleGallery({ images, vehicleName }: VehicleGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const touchStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const imageCount = images.length;
  const currentImage = images[activeIndex];

  const showImage = (index: number, nextDirection?: number) => {
    if (imageCount <= 1) return;

    const wrappedIndex = (index + imageCount) % imageCount;
    setDirection(nextDirection ?? (wrappedIndex > activeIndex ? 1 : -1));
    setActiveIndex(wrappedIndex);
    setZoom(MIN_ZOOM);
  };

  const showPrevious = () => showImage(activeIndex - 1, -1);
  const showNext = () => showImage(activeIndex + 1, 1);

  const openViewer = () => {
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }
    setZoom(MIN_ZOOM);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setZoom(MIN_ZOOM);
    setIsViewerOpen(false);
  };

  const zoomIn = () => setZoom((value) => Math.min(MAX_ZOOM, value + ZOOM_STEP));
  const zoomOut = () => setZoom((value) => Math.max(MIN_ZOOM, value - ZOOM_STEP));

  useEffect(() => {
    thumbnailRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
    });
  }, [activeIndex]);

  useEffect(() => {
    if (!isViewerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeViewer();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "+" || event.key === "=") zoomIn();
      if (event.key === "-") zoomOut();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  if (!imageCount) return null;

  return (
    <section className="min-w-0" aria-label={`${vehicleName} photo gallery`}>
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-lg border border-black/10 bg-zinc-950 shadow-luxury dark:border-white/10"
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
          didSwipe.current = false;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null || imageCount <= 1) return;
          const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
          const distance = touchStartX.current - endX;
          touchStartX.current = null;

          if (Math.abs(distance) < 45) return;
          didSwipe.current = true;
          if (distance > 0) showNext();
          else showPrevious();
        }}
      >
        <AnimatePresence initial={false} mode="popLayout" custom={direction}>
          <motion.button
            key={currentImage}
            type="button"
            aria-label={`Open photo ${activeIndex + 1} of ${imageCount} in full screen`}
            title="Open full-screen photo"
            className="absolute inset-0 cursor-zoom-in"
            custom={direction}
            initial={{ opacity: 0, x: direction * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -28 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={openViewer}
          >
            <Image
              src={currentImage}
              alt={`${vehicleName} photo ${activeIndex + 1}`}
              fill
              priority={activeIndex === 0}
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-contain"
            />
          </motion.button>
        </AnimatePresence>

        {imageCount > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              title="Previous photo"
              onClick={showPrevious}
              className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/70 text-white shadow-lg backdrop-blur transition hover:bg-racing focus:outline-none focus:ring-2 focus:ring-white sm:left-4 sm:h-12 sm:w-12"
            >
              <ChevronLeft aria-hidden="true" size={26} />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              title="Next photo"
              onClick={showNext}
              className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/70 text-white shadow-lg backdrop-blur transition hover:bg-racing focus:outline-none focus:ring-2 focus:ring-white sm:right-4 sm:h-12 sm:w-12"
            >
              <ChevronRight aria-hidden="true" size={26} />
            </button>
          </>
        ) : null}

        <div className="absolute bottom-3 left-3 z-10 rounded-md bg-black/70 px-3 py-2 text-xs font-black text-white backdrop-blur sm:bottom-4 sm:left-4">
          {activeIndex + 1} / {imageCount}
        </div>
        <button
          type="button"
          aria-label="Open full-screen photo viewer"
          title="View full screen"
          onClick={() => setIsViewerOpen(true)}
          className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-black/70 text-white shadow-lg backdrop-blur transition hover:bg-racing focus:outline-none focus:ring-2 focus:ring-white sm:right-4 sm:top-4"
        >
          <Expand aria-hidden="true" size={21} />
        </button>
      </div>

      {imageCount > 1 ? (
        <div className="mt-3 flex snap-x gap-2 overflow-x-auto pb-2" aria-label="Select a vehicle photo">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              ref={(element) => {
                thumbnailRefs.current[index] = element;
              }}
              type="button"
              aria-label={`Show photo ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => showImage(index)}
              className={`relative h-16 w-24 shrink-0 snap-center overflow-hidden rounded-md border-2 bg-zinc-200 transition sm:h-20 sm:w-28 ${
                index === activeIndex
                  ? "border-racing shadow-card"
                  : "border-transparent opacity-70 hover:opacity-100 dark:border-white/10"
              }`}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="112px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      <AnimatePresence>
        {isViewerOpen ? (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/95 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${vehicleName} full-screen photo viewer`}
          >
            <div className="absolute inset-x-0 top-0 z-20 flex h-16 items-center justify-between border-b border-white/15 bg-black/80 px-3 sm:px-6">
              <p className="text-sm font-black">
                Photo {activeIndex + 1} of {imageCount}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Zoom out"
                  title="Zoom out"
                  disabled={zoom === MIN_ZOOM}
                  onClick={zoomOut}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/20 transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <Minus aria-hidden="true" size={20} />
                </button>
                <span className="w-12 text-center text-xs font-black">{Math.round(zoom * 100)}%</span>
                <button
                  type="button"
                  aria-label="Zoom in"
                  title="Zoom in"
                  disabled={zoom === MAX_ZOOM}
                  onClick={zoomIn}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/20 transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <Plus aria-hidden="true" size={20} />
                </button>
                <button
                  type="button"
                  aria-label="Close full-screen viewer"
                  title="Close"
                  onClick={closeViewer}
                  className="ml-1 grid h-10 w-10 place-items-center rounded-full border border-white/20 transition hover:bg-racing"
                >
                  <X aria-hidden="true" size={22} />
                </button>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 top-16 overflow-auto overscroll-contain">
              <div
                className="relative mx-auto cursor-zoom-in"
                style={{
                  width: `${zoom * 100}%`,
                  height: `${zoom * 100}%`,
                  minHeight: "100%",
                  minWidth: "100%"
                }}
                onDoubleClick={() => setZoom((value) => (value === MIN_ZOOM ? 2 : MIN_ZOOM))}
              >
                <Image
                  src={currentImage}
                  alt={`${vehicleName} photo ${activeIndex + 1}`}
                  fill
                  priority
                  sizes="100vw"
                  className="select-none object-contain p-3 sm:p-8"
                  draggable={false}
                />
              </div>
            </div>

            {imageCount > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Previous photo"
                  title="Previous photo"
                  onClick={showPrevious}
                  className="absolute left-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/70 shadow-lg ring-1 ring-white/20 transition hover:bg-racing sm:left-6 sm:h-14 sm:w-14"
                >
                  <ChevronLeft aria-hidden="true" size={30} />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  title="Next photo"
                  onClick={showNext}
                  className="absolute right-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/70 shadow-lg ring-1 ring-white/20 transition hover:bg-racing sm:right-6 sm:h-14 sm:w-14"
                >
                  <ChevronRight aria-hidden="true" size={30} />
                </button>
              </>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
