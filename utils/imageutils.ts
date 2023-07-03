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
      ctx.drawImage(target, 0, 0, canvas.width, canvas.height);
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

const convertToB64 = (filesList: FileList) =>
  new Promise<string>((resolve, reject) => {
    const file = filesList[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const { result } = reader;
      if (typeof result !== "string") {
        throw TypeError("Reader did not return string.");
      }
      resolve(result);
    });

    reader.addEventListener("error", () => {
      reject(reader.error);
    });

    reader.readAsDataURL(file);
  });
