// from https://stackoverflow.com/a/39637827
function scaleDownImageWithStep(img: HTMLImageElement, width: number) {
  const canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d"),
    oc = document.createElement("canvas"),
    octx = oc.getContext("2d");

  canvas.width = width; // destination canvas size
  canvas.height = canvas.width * img.height / img.width;

  let cur = {
    width: Math.floor(img.width * 0.5),
    height: Math.floor(img.height * 0.5),
  };

  oc.width = cur.width;
  oc.height = cur.height;

  octx?.drawImage(img, 0, 0, cur.width, cur.height);

  while (cur.width * 0.5 > width) {
    cur = {
      width: Math.floor(cur.width * 0.5),
      height: Math.floor(cur.height * 0.5),
    };
    octx?.drawImage(
      oc,
      0,
      0,
      cur.width * 2,
      cur.height * 2,
      0,
      0,
      cur.width,
      cur.height,
    );
  }

  ctx?.drawImage(
    oc,
    0,
    0,
    cur.width,
    cur.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return canvas;
}

export function encode(
  src: string,
  quality: number,
  maxWidth: number,
  maxHeight: number,
  format: "image/jpeg" | "image/png" | "image/webp" = "image/webp",
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const image = new Image();
    image.onload = (ev) => {
      const target = ev?.target as HTMLImageElement;
      const { width, height } = target;
      if (maxWidth && maxHeight && (width > maxWidth || height > maxHeight)) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        canvas.width = width * ratio;
        canvas.height = height * ratio;
      } else {
        canvas.width = width;
        canvas.height = height;
      }

      URL.revokeObjectURL(target.src);
      const scaledCanvas = scaleDownImageWithStep(target, canvas.width);
      ctx.drawImage(scaledCanvas, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (data) => {
          if (data) {
            resolve(data);
          } else {
            reject(new Error("Failed to convert to " + format + " image"));
          }
        },
        format,
        quality,
      );
    };

    image.src = src;
    image.onerror = (e) => reject(e);
  });
}

export function toDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const target = ev?.target as FileReader;
      if (target) {
        resolve(target.result as string);
      } else {
        reject(new Error("Failed to convert to file url"));
      }
    };
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(blob);
  });
}
