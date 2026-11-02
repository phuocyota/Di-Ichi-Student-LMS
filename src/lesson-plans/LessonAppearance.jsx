import React, { useEffect, useState } from "react";
import { downloadPortalImage } from "../services/lessonPlanApi.js";
import {
  ANIMATIONS,
  MASCOTS,
  BACKGROUNDS,
  normalizeAppearance,
  safeBackgroundUrl,
  validatedImageBlob,
} from "./appearance.js";
import "./lesson-appearance.css";
import LessonMascot from "./LessonMascot.jsx";

export function LessonScene({
  appearance: raw,
  children,
  className = "",
  mini = false,
  paused = false,
}) {
  const a = normalizeAppearance(raw);
  const [image, setImage] = useState(""),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    let objectUrl;
    setError("");
    setImage("");
    setLoading(false);
    if (a.background === "image" && a.backgroundFileId) {
      setLoading(true);
      downloadPortalImage(a.backgroundFileId, controller.signal)
        .then(validatedImageBlob)
        .then((blob) => {
          if (controller.signal.aborted) return;
          objectUrl = URL.createObjectURL(blob);
          setImage(objectUrl);
        })
        .catch((e) => {
          if (!controller.signal.aborted) setError(e.message);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    } else if (a.background === "image" && a.backgroundImage) {
      const url = safeBackgroundUrl(a.backgroundImage);
      if (url) setImage(url);
      else setError("Liên kết ảnh nền không hợp lệ");
    }
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [a.background, a.backgroundFileId, a.backgroundImage]);
  return (
    <div
      className={
        "lp-scene lp-scene-" +
        a.background +
        " " +
        (mini ? "lp-scene-mini " : "") +
        className +
        (a.mascot !== "none" ? " lp-scene-has-mascot" : "")
      }
      data-animation={a.animation}
      data-paused={paused}
      data-mascot-side={a.mascotSide}
      style={{ "--lp-background-opacity": a.opacity / 100 }}
    >
      <div className="lp-scene-backdrop" aria-hidden="true">
        {image && (
          <img
            src={image}
            alt=""
            referrerPolicy="no-referrer"
            onError={() =>
              setError(
                "Không tải được ảnh nền. Kiểm tra liên kết hoặc quyền truy cập ảnh.",
              )
            }
          />
        )}
      </div>
      {a.decorations && (
        <div className="lp-scene-decorations" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} />
          ))}
        </div>
      )}
      {a.mascot !== "none" && (
        <div className="lp-scene-mascot">
          <LessonMascot type={a.mascot} motion={a.mascotMotion} />
        </div>
      )}
      <div className="lp-scene-content">
        {loading && (
          <p className="lp-scene-status" role="status">
            Đang tải ảnh nền…
          </p>
        )}
        {error && (
          <p className="lp-scene-error" role="alert">
            {error}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

