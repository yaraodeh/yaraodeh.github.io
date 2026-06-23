export const fileExt = (filename: string): string =>
  filename.split(".").pop()?.toLowerCase() ?? "jpg";

export const readBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve((r.result as string).split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
