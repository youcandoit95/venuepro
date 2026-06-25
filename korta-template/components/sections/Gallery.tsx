"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useLang } from "@/lib/i18n/LangProvider";
import { galleryImages } from "@/lib/data/content";

export function Gallery() {
  const { t } = useLang();
  const [active, setActive] = useState<number | null>(null);
  const total = galleryImages.length;
  const lastFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setActive(null);
    lastFocus.current?.focus();
  }, []);
  const go = useCallback(
    (dir: number) => setActive((a) => (a === null ? a : (a + dir + total) % total)),
    [total],
  );

  useEffect(() => {
    if (active === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, go]);

  return (
    <section id="gallery" className="bg-paper py-24 md:py-32">
      <Container>
        <SectionHeader
          align="center"
          label={t({ id: "Galeri", en: "Gallery" })}
          meta={t({ id: "momen di KLAY", en: "moments at KLAY" })}
          title={t({ id: "Sore yang tak terlupakan.", en: "Unforgettable evenings." })}
        />

        <div className="mt-12 columns-2 gap-4 md:columns-3 [&>*]:mb-4">
          {galleryImages.map((img, i) => (
            <motion.button
              key={i}
              onClick={(e) => {
                lastFocus.current = e.currentTarget;
                setActive(i);
              }}
              aria-label={t({ id: `Perbesar: ${t(img.alt)}`, en: `Enlarge: ${t(img.alt)}` })}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative block w-full break-inside-avoid overflow-hidden rounded-[16px] bg-mist"
            >
              <Image
                src={img.src}
                alt={t(img.alt)}
                width={800}
                height={img.tall ? 1067 : 600}
                sizes="(max-width: 768px) 50vw, 30vw"
                className="editorial-img h-auto w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-forest/0 transition-colors duration-500 group-hover:bg-forest/10" />
            </motion.button>
          ))}
        </div>
      </Container>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t({ id: "Pratinjau galeri", en: "Gallery preview" })}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-forest/92 p-6 backdrop-blur-sm"
          >
            <button
              onClick={close}
              aria-label={t({ id: "Tutup", en: "Close" })}
              autoFocus
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full text-paper hover:bg-paper/10"
            >
              <X size={26} strokeWidth={1.5} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              aria-label={t({ id: "Sebelumnya", en: "Previous" })}
              className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full text-paper hover:bg-paper/10 md:left-6"
            >
              <ChevronLeft size={28} strokeWidth={1.5} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); go(1); }}
              aria-label={t({ id: "Berikutnya", en: "Next" })}
              className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full text-paper hover:bg-paper/10 md:right-6"
            >
              <ChevronRight size={28} strokeWidth={1.5} />
            </button>

            <motion.figure
              key={active}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-h-[82vh] w-full max-w-3xl overflow-hidden rounded-[20px]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={galleryImages[active].src}
                alt={t(galleryImages[active].alt)}
                width={1200}
                height={800}
                className="h-auto max-h-[82vh] w-full object-contain"
              />
            </motion.figure>

            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-paper/70">
              {active + 1} / {total}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
