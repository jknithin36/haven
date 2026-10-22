import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Delete02Icon,
  ImageUpload01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { motion, useReducedMotion } from "motion/react";
import { useId, useState, type DragEvent, type ReactNode } from "react";

import Icon from "@/components/admin/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { propertyEditorPage } from "@/data/admin";
import { imageFileToDataUrl, isImageUrl } from "@/lib/image-file";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Photo } from "@/store/properties";

const copy = propertyEditorPage.photos;

function move<T>(list: T[], from: number, to: number) {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function PhotoButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="admin-focus flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}

// Drop zone, "Add by URL", and a reorderable grid. Drag a photo onto another
// to move it; the arrow buttons do the same from the keyboard.
function PhotosField({
  value,
  onChange,
  invalid,
}: {
  value: Photo[];
  onChange: (photos: Photo[]) => void;
  invalid?: boolean;
}) {
  const id = useId();
  const reduceMotion = useReducedMotion();
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [fileError, setFileError] = useState("");
  const [reading, setReading] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);
  const [overZone, setOverZone] = useState(false);

  async function addFiles(files: FileList | null) {
    const images = [...(files ?? [])].filter((f) =>
      f.type.startsWith("image/"),
    );
    if (images.length === 0) return;
    setReading(true);
    setFileError("");
    const added: Photo[] = [];
    for (const file of images) {
      try {
        added.push({
          id: crypto.randomUUID(),
          src: await imageFileToDataUrl(file),
          alt: "",
        });
      } catch {
        setFileError(copy.unreadable);
      }
    }
    setReading(false);
    onChange([...value, ...added]);
  }

  function addUrl() {
    const src = url.trim();
    if (!isImageUrl(src)) {
      setUrlError(copy.badUrl);
      return;
    }
    onChange([...value, { id: crypto.randomUUID(), src, alt: "" }]);
    setUrl("");
    setUrlError("");
  }

  function onZoneDrop(e: DragEvent) {
    e.preventDefault();
    setOverZone(false);
    if (e.dataTransfer.files.length > 0) void addFiles(e.dataTransfer.files);
  }

  function onPhotoDrop(e: DragEvent, to: number) {
    e.preventDefault();
    e.stopPropagation();
    if (dragging !== null && dragging !== to) {
      onChange(move(value, dragging, to));
    }
    setDragging(null);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      <label
        htmlFor={`${id}-files`}
        onDragOver={(e) => {
          if (dragging !== null) return;
          e.preventDefault();
          setOverZone(true);
        }}
        onDragLeave={() => setOverZone(false)}
        onDrop={onZoneDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-2 rounded-[14px] border border-dashed border-input px-6 py-10 text-center transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2 hover:bg-subtle",
          overZone && "border-foreground bg-subtle",
          invalid && "border-attention",
        )}
      >
        <Icon icon={ImageUpload01Icon} className="text-muted-foreground" />
        <span>
          {reading ? (
            <span aria-live="polite">{copy.reading}</span>
          ) : (
            <>
              {copy.drop}{" "}
              <span className="font-medium underline underline-offset-4">
                {copy.browse}
              </span>
            </>
          )}
        </span>
        <span className="text-xs text-faint">{copy.types}</span>
        <input
          id={`${id}-files`}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => {
            void addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>
      {fileError && (
        <p role="alert" className="text-sm text-attention">
          {fileError}
        </p>
      )}

      {/* Add by URL */}
      <div>
        <label htmlFor={`${id}-url`} className="sr-only">
          {copy.urlLabel}
        </label>
        <div className="flex gap-2">
          <Input
            id={`${id}-url`}
            type="url"
            value={url}
            placeholder={copy.urlPlaceholder}
            aria-invalid={!!urlError}
            aria-describedby={urlError ? `${id}-url-error` : undefined}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={addUrl}
            className="shrink-0"
          >
            {copy.addUrl}
          </Button>
        </div>
        {urlError && (
          <p
            id={`${id}-url-error`}
            role="alert"
            className="mt-2 text-sm text-attention"
          >
            {urlError}
          </p>
        )}
      </div>

      {/* Photos */}
      {value.length > 0 && (
        <>
          <p className="admin-meta" aria-live="polite">
            {copy.count(value.length)}
          </p>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {value.map((photo, i) => (
              <li
                key={photo.id}
                draggable
                onDragStart={(e) => {
                  setDragging(i);
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragEnd={() => setDragging(null)}
                onDragOver={(e) => {
                  if (dragging === null) return;
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => onPhotoDrop(e, i)}
                className={cn(
                  "cursor-grab active:cursor-grabbing",
                  dragging === i && "opacity-40",
                )}
              >
                <motion.div
                  layout={!reduceMotion}
                  transition={{ duration: 0.2, ease: EASE }}
                >
                  <div className="relative aspect-4/3 overflow-hidden rounded-[10px] bg-muted">
                    <img
                      src={photo.src}
                      alt=""
                      draggable={false}
                      className="h-full w-full object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute top-2 left-2 rounded-full bg-background px-2 py-0.5 text-xs font-medium">
                        {copy.cover}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <div className="flex">
                      <PhotoButton
                        label={copy.moveUp}
                        disabled={i === 0}
                        onClick={() => onChange(move(value, i, i - 1))}
                      >
                        <Icon icon={ArrowLeft01Icon} size={16} />
                      </PhotoButton>
                      <PhotoButton
                        label={copy.moveDown}
                        disabled={i === value.length - 1}
                        onClick={() => onChange(move(value, i, i + 1))}
                      >
                        <Icon icon={ArrowRight01Icon} size={16} />
                      </PhotoButton>
                      <PhotoButton
                        label={copy.setCover}
                        disabled={i === 0}
                        onClick={() => onChange(move(value, i, 0))}
                      >
                        <Icon icon={StarIcon} size={16} />
                      </PhotoButton>
                    </div>
                    <PhotoButton
                      label={copy.remove}
                      onClick={() =>
                        onChange(value.filter((p) => p.id !== photo.id))
                      }
                    >
                      <Icon icon={Delete02Icon} size={16} />
                    </PhotoButton>
                  </div>
                </motion.div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default PhotosField;
